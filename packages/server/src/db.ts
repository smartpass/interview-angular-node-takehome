import { mapKeys, pickBy } from 'lodash'
import { type Database } from 'sqlite'
import type * as sqlite3 from 'sqlite3'

import { type Locations, type Passes, type Students } from '@smartpass/angular-node-takehome-common'

import { type EmitterSelector, type ResourceEmitters } from './event'

type Db = Database<sqlite3.Database, sqlite3.Statement>

export type Where = Array<{
  column: string
  restriction: string
}>

export interface GetParams {
  sort?: {
    column: string
    direction: 'asc' | 'desc'
  }
  where?: Where
  limit?: number
  offset?: number
}

export interface UpdateParams<T> {
  changes: Partial<T>
  where: Where
}

const buildWhereQueryFragment = (where?: Where) => {
  let fragment = ''

  if (where && where.length > 0) {
    fragment += ' where '

    fragment += where.map(({ column, restriction }) => ` ${column} ${restriction}`).join(' and ')
  }

  return fragment
}

const buildGetQuery = (selector: string, params: GetParams) => {
  let query = selector

  query += buildWhereQueryFragment(params.where)

  if (params.sort) {
    query += ` order by ${params.sort.column} ${params.sort.direction}`
  }

  if (params.limit) {
    query += ` limit ${params.limit}`
  }

  if (params.offset) {
    query += ` offset ${params.offset}`
  }

  return query
}

const buildUpsertFragment = <T extends object>(item: T) => {
  const dbItem = mapKeys(item, (_, k) => `$${k}`)

  return {
    columnNames: `${Object.keys(item).join(',')}`,
    variableNames: `${Object.keys(dbItem).join(',')}`,
    dbItem,
  }
}

const getResource =
  <T>(selector: string) =>
  async (db: Db, params: GetParams = {}) => {
    return await db.all<T[]>(buildGetQuery(selector, params))
  }

interface DbResource {
  students: {
    create: Students.Create
    retrieve: Students.Retrieve
    update: Students.Update
    singluar: 'student'
  }
  locations: {
    create: Locations.Create
    retrieve: Locations.Retrieve
    update: Locations.Update
    singluar: 'location'
  }
  passes: {
    create: Passes.Create
    retrieve: Passes.Retrieve
    update: Passes.Update
    singluar: 'pass'
  }
}

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never

const insertResource =
  <K extends keyof DbResource>(
    table: K,
    emitterSelector: EmitterSelector<DbResource[K]['singluar']>,
  ) =>
  async (db: Db, resourceEmitters: ResourceEmitters, item: DbResource[K]['create']) => {
    const { columnNames, variableNames, dbItem } = buildUpsertFragment(item)

    const query = `insert into ${table}(${columnNames}) values (${variableNames}) returning *`

    const dbResult = (await db.all<Array<DbResource[K]['retrieve']>>(query, dbItem))[0]

    // hack to satisfy typecheker
    emitterSelector(resourceEmitters).emitResourceCreated(
      dbResult as UnionToIntersection<DbResource[keyof DbResource]['retrieve']>,
    )

    return dbResult
  }

const updateResource =
  <K extends keyof DbResource>(
    table: K,
    emitterSelector: EmitterSelector<DbResource[K]['singluar']>,
  ) =>
  async (
    db: Db,
    resourceEmitters: ResourceEmitters,
    params: UpdateParams<DbResource[K]['update']>,
  ) => {
    const { columnNames, variableNames, dbItem } = buildUpsertFragment(params.changes)
    const whereFragment = buildWhereQueryFragment(params.where)

    const query = `update ${table} set (${columnNames}) = (${variableNames}) ${whereFragment} returning *`

    const dbResult = (await db.all<Array<DbResource[K]['retrieve']>>(query, dbItem))[0]

    // hack to satisfy typecheker
    emitterSelector(resourceEmitters).emitResourceUpdated(
      dbResult as UnionToIntersection<DbResource[keyof DbResource]['retrieve']>,
    )

    return dbResult
  }

export const getStudents = getResource<Students.Retrieve>('select * from students')
export const getStudentCount = async (db: Db) => {
  // todo: abstract this so it can work for different tables
  const sqlResponse = await db.get('select count(*) as cnt from students')
  return sqlResponse.cnt
}
export const insertStudent = insertResource('students', (emitters) => emitters.student)

export const getLocations = getResource<Locations.Retrieve>('select * from locations')

export const getPasses = getResource<Passes.Retrieve>('select * from passes')
export const insertPass = insertResource('passes', (emitters) => emitters.pass)
export const updatePass = updateResource('passes', (emitters) => emitters.pass)
export const getPasseWithMetadata = async (db: Db, params: GetParams = {}) => {
  const selector = `select p.id as pass_id, p.start_time as pass_start_time, p.duration_minutes as pass_duration_minutes, p.end_time as pass_end_time,
    s.id as student_id, s.name as student_name, s.grade as student_grade, s.profile_picture_url as student_profile_picture_url,
    source.id as source_id, source.name as source_name, source.icon as source_icon,
    destination.id as destination_id, destination.name as destination_name, destination.icon as destination_icon
    from passes p
    left join students s on p.student_id = s.id
    left join locations source on p.source_id = source.id
    left join locations destination on p.destination_id = destination.id
  `

  const flatRows = await db.all(buildGetQuery(selector, params))

  return flatRows.map((row) => ({
    ...mapKeys(
      pickBy(row, (_, key) => key.startsWith('pass_')),
      (_, key) => key.replace(/^pass_/, ''),
    ),
    student: mapKeys(
      pickBy(row, (_, key) => key.startsWith('student_')),
      (_, key) => key.replace(/^student_/, ''),
    ),
    source: mapKeys(
      pickBy(row, (_, key) => key.startsWith('source_')),
      (_, key) => key.replace(/^source_/, ''),
    ),
    destination: mapKeys(
      pickBy(row, (_, key) => key.startsWith('destination_')),
      (_, key) => key.replace(/^destination_/, ''),
    ),
  }))
}
