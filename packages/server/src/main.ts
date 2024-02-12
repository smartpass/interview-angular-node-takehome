import express, { Express, Request, Response } from 'express'
import pino from 'pino'
import pinoHttp from 'pino-http'
import { Server } from 'ws'
import { ClientMessage, ServerMessage } from '@smartpass/angular-node-takehome-common'

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  }
})

const app: Express = express()

const websocket = new Server({ noServer: true })
const port = 3000

app.use(pinoHttp({ logger }))

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

websocket.on('connection', (ws, req) => {
  logger.debug('Connected to client at %o', req.socket.address())  
  
  ws.on('error', e => logger.error(e, 'Connection error'))

  ws.send(JSON.stringify({op: 'start', data: 'welocome!'}))

  ws.on('message', (data) => {
    const {op, data: d} = JSON.parse(data.toString()) as ClientMessage
    logger.debug('Received op %s, data %o', op, d)
    ws.send(JSON.stringify({op: 'echo', data: d} as ServerMessage))
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

process.on('SIGTERM', () => {
  logger.debug('Termination signal received, closing server')
  server.close(() => {
    logger.debug('Server closed')
  })
  websocket.clients.forEach((ws) => ws.close(1001))
})
