import { Locations, Passes, Students } from "@smartpass/angular-node-takehome-common";
import { mapKeys } from "lodash";
import { Database } from "sqlite";
import * as sqlite from "sqlite3";

type Db = Database<sqlite.Database, sqlite.Statement>


interface GetParams {
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

const getResource = <T>(table: string) => async (db: Db, params: GetParams = {}) => {
  let query = `select * from ${table}`

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

  return await db.all<T[]>(query)
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

export const getStudents = getResource<Students.Model.Retrieve>('students')
export const insertStudent = insertResource<Students.Model.Create, Students.Model.Retrieve>('students')

export const getLocations = getResource<Locations.Model.Retrieve>('locations')

export const getPasses = getResource<Passes.Model.Retrieve>('passes')

