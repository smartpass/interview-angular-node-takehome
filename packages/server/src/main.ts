import { Messages, Students } from '@smartpass/angular-node-takehome-common'
import cors from 'cors'
import express, { Express, NextFunction, Request, Response, json } from 'express'
import * as sqlite from 'sqlite3'
import { open } from 'sqlite'
import pino from 'pino'
import pinoHttp from 'pino-http'
import { Server } from 'ws'
import { inspect } from 'util'
import { ParsedQs } from 'qs'
import { getLocations, getPasses, getStudents, insertStudent } from './db'
import { toDb, toWire } from './utils'

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  }
});

const db = (async () => {
  const db = await open({
    filename: ':memory:',
    driver: sqlite.verbose().Database,
  })

  logger.debug('Running migrations')
  await db.migrate()

  const newStudents: Students.Model.Create[] = []
  for (let i = 0; i < 100; i++) {
    const name = `student ${i}`
    newStudents.push({
      name,
      profilePictureUrl: `https://gravatar.com/avatar/${encodeURIComponent(name)}?s=400&d=robohash&r=x`,
      grade: '1'
    })
  }

  const statement = await db.prepare('insert into students (name) values (?) returning *')

  const students = (await Promise.all(
      newStudents.map(({name}) => statement.all<Students.Model.Retrieve>(name))
      )
  ).flatMap(a => a)

  await statement.finalize()

  // const students = await db.all('select * from students')
  logger.debug(`students ${inspect(students[students.length - 1])}`)

  return db
})()

const app: Express = express()

const websocket = new Server({ noServer: true })
const port = 3000

app.use(
  pinoHttp({ logger }),
  cors(),
  json())

const getterRoute = <T extends object, F extends (_: ParsedQs) => Promise<T[]>>(getData: F) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getData(toDb([req.query])[0])
      res.json(toWire(result))
    } catch (error) {
      next(error)
    }
  }

const setterRoute = <T extends object, R extends object, F extends (_: T) => Promise<R[]> = (_: T) => Promise<R[]>>
  (insertData: F) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await insertData({...req.body, id: undefined})
        res.status(201).json(result)
      } catch (error) {
        next(error)
      }
    }

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.route('/students')
  .get(getterRoute(async (params) => getStudents(await db, params)))
  .post(setterRoute<Students.Model.Create, Students.Model.Retrieve>(
    async (s) => insertStudent(await db, s)))

app.route('/locations')
  .get(getterRoute(async (params) => getLocations(await db, params)))

app.route('/passes')
  .get(getterRoute(async (params) => getPasses(await db, params)))

websocket.on('connection', (ws, req) => {
  logger.debug('Connected to client at %o', req.socket.address())

  ws.on('error', e => logger.error(e, 'Connection error'))

  ws.send(JSON.stringify({op: 'start', data: 'welocome!'}))

  ws.on('message', (data) => {
    const {op, data: d} = JSON.parse(data.toString()) as Messages.ClientMessage
    logger.debug('Received op %s, data %o', op, d)
    ws.send(JSON.stringify({op: 'echo', data: d} as Messages.ServerMessage))
  })

  let isAlive = true
  ws.on('pong', () => {
    isAlive = true
  })
  const heartbeatInterval = setInterval(() => {
    if (!isAlive) {
      ws.terminate()
    } else {
      isAlive = false
      ws.ping()
    }
  }, 10000)

  ws.on('close', (code, reason) => {
    logger.debug(`Closed connection with code ${code}, reason ${JSON.stringify(reason.toString())}`)
    clearInterval(heartbeatInterval)
  })
})

const server = app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
})

server.on('upgrade', (req, socket, head) => {
  websocket.handleUpgrade(req, socket, head, (ws) => {
    websocket.emit('connection', ws, req)
  })
})

const cleanup = async () => {
  logger.debug('Termination signal received, closing server')
  server.close((err) => {
    logger.debug(err, 'Server closed')
  })
  websocket.clients.forEach((ws) => ws.close(1001))

  try {
    await (await db).close()
    logger.debug('Database closed')
  } catch (err) {
    logger.debug(err, 'Database closed with error')
  } finally {
    process.exit(0)
  }
}

process.on('SIGTERM', cleanup)
process.on('SIGINT', cleanup)
