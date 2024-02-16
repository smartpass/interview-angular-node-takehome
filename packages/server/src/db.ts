import { Locations, Passes, Students } from "@smartpass/angular-node-takehome-common";
import { mapKeys, pickBy } from "lodash";
import { Database } from "sqlite";
import * as sqlite from "sqlite3";

type Db = Database<sqlite.Database, sqlite.Statement>


export interface GetParams {
  sort?: {
    column: string,
    direction: 'asc' | 'desc',
  }
  where?: {
    column: string,
    restriction: string
  }[]
  limit?: number
}

const buildGetQuery = (selector: string, params: GetParams) => {
  let query = selector

  if (params.where && params.where.length > 0) {
    query += ' where '

    query += params.where
      .map(({column, restriction}) => ` ${column} ${restriction}`).join(' and ')
  }

  if (params.sort) {
    query += ` order by ${params.sort.column} ${params.sort.direction}`
  }

  if (params.limit) {
    query += ` limit ${params.limit}`
  }

  return query
}

const getResource = <T>(selector: string) => async (db: Db, params: GetParams = {}) => {
  return await db.all<T[]>(buildGetQuery(selector, params))
}

const insertResource = <T extends object, R extends object>(table: string) => async (db: Db, item: T) => {
  let query = `insert into ${table}(`

  const dbItem = mapKeys(item, (_, k) => `$${k}`)

  query += `${Object.keys(item).join(',')}`

  query += ') values ('

  query += `${Object.keys(dbItem).join(',')}`

  query += ') returning *'

  return db.all<R[]>(query, dbItem)
}

export const getStudents = getResource<Students.Model.Retrieve>('select * from students')
export const insertStudent = insertResource<Students.Model.Create, Students.Model.Retrieve>('students')

export const getLocations = getResource<Locations.Model.Retrieve>('select * from locations')

export const getPasses = getResource<Passes.Model.Retrieve>('select * from passes')
export const insertPass = insertResource<Passes.Model.Create, Passes.Model.Retrieve>('passes')
export const getPasseWithMetadata = async (db: Db, params: GetParams = {}) => {
  const selector =
  `select p.id as pass_id, p.start_time as pass_start_time, p.duration_minutes as pass_duration_minutes, p.end_time as pass_end_time,
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
    ...mapKeys(pickBy(row, (_, key) => key.startsWith('pass_')), (_, key) => key.replace(/^pass\_/, '')),
    student: mapKeys(pickBy(row, (_, key) => key.startsWith('student_')), (_, key) => key.replace(/^student\_/, '')),
    source: mapKeys(pickBy(row, (_, key) => key.startsWith('source_')), (_, key) => key.replace(/^source\_/, '')),
    destination: mapKeys(pickBy(row, (_, key) => key.startsWith('destination_')), (_, key) => key.replace(/^destination\_/, '')),
  }))
}
