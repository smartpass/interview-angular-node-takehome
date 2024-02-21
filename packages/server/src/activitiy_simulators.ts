/**
 * This file contain helpers for simulating activity for the exercise. Please do not edit any functions here.
 */
import { faker } from '@faker-js/faker'
import { partial, range } from 'lodash'
import { DateTime } from 'luxon'
import { type Database } from 'sqlite'
import type * as sqlite3 from 'sqlite3'

import { Students } from '@smartpass/angular-node-takehome-common'
import { Grade } from '@smartpass/angular-node-takehome-common/src/students'

import { getLocations, getPasses, getStudents, insertPass, insertStudent, updatePass } from './db'
import { type ResourceEmitters } from './event'
import { toDb } from './utils'

const getRandom = (minValue: number, range: number) => minValue + Math.round(Math.random() * range)

/**
 * Runs a callback on a recurring interval between minMs and rangeMs.
 */
export const setRandomInterval = (callback: () => void, minMs: number, rangeMs: number) => {
  const ms = getRandom(minMs, rangeMs)
  let timeout = setTimeout(() => {
    callback()
    timeout = setRandomInterval(callback, minMs, rangeMs)()
  }, ms)

  return () => timeout
}

/**
 * Creates a random pass associated with a random student, source, and destination.
 */
export const createPass = async (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  resourceEmitters: ResourceEmitters,
) => {
  const activePasses = await getPasses(db, {
    where: [{ column: 'end_time', restriction: 'is null' }],
  })

  if (activePasses.length < 10) {
    const studentCount = (await getStudents(db)).length
    const studentId = getRandom(0, studentCount)

    const locationCount = (await getLocations(db)).length
    const sourceId = getRandom(0, locationCount)
    const destinationId = getRandom(0, locationCount)

    await insertPass(
      db,
      resourceEmitters,
      toDb([
        {
          studentId,
          sourceId,
          destinationId,
          startTime: DateTime.now().toISO(),
          durationMinutes: getRandom(1, 10),
        },
      ])[0],
    )
  }
}

/**
 * Ends a random active pass.
 */
export const endPass = async (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  resourceEmitters: ResourceEmitters,
) => {
  const activePasses = await getPasses(db, {
    where: [{ column: 'end_time', restriction: 'is null' }],
  })
  const pass = activePasses[getRandom(0, activePasses.length - 1)]

  if (activePasses.length > 2) {
    await updatePass(db, resourceEmitters, {
      changes: toDb([{ endTime: DateTime.now().toISO() }])[0],
      where: [{ column: 'id', restriction: ` = ${pass.id}` }],
    })
  }
}

/**
 * Generates mock student entries.
 */
export const generateStudents = async (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  resourceEmitters: ResourceEmitters,
) => {
  const newStudents: Students.Create[] = []
  for (let i = 0; i < 100; i++) {
    const name = faker.person.fullName()
    newStudents.push({
      name,
      profilePictureUrl: `https://gravatar.com/avatar/${encodeURIComponent(name)}?s=400&d=robohash&r=x`,
      grade: faker.number.int({ min: 1, max: 12 }).toString() as Grade,
    })
  }

  await Promise.all(toDb(newStudents).map(partial(insertStudent, db, resourceEmitters)))
}

/**
 * Generates mock pass entries.
 */
export const generatePasses = async (
  db: Database<sqlite3.Database, sqlite3.Statement>,
  resourceEmitters: ResourceEmitters,
) => {
  await Promise.all(
    range(6).map(async () => {
      await createPass(db, resourceEmitters)
    }),
  )
}
