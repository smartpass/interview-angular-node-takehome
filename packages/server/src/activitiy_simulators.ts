/**
 * This file contain helpers for simulating activity for the exercise. Please do not edit any functions here.
 */

import { DateTime } from "luxon"
import { getLocations, getPasses, getStudents, insertPass, updatePass } from "./db"
import { toDb } from "./utils"
import { Database } from "sqlite"
import * as sqlite3 from 'sqlite3'

const getRandom = (minValue: number, range: number) =>
  minValue + Math.round(Math.random() * range)

/**
 * Runs a callback on a recurring interval between minMs and rangeMs.
 */
export const setRandomInterval = (callback: () => void, minMs: number, rangeMs: number) => {
  const ms = getRandom(minMs, rangeMs)
  setInterval(() => {
    callback()
    setRandomInterval(callback, minMs, rangeMs)
  }, ms)
}

/**
 * Creates a random pass associated with a random student, source, and destination.
 */
export const createPass = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
  const activePasses = await getPasses(db, {where: [{column: 'end_time', restriction: 'is null'}]})

  if (activePasses.length < 10) {
    const studentCount = (await getStudents(db)).length
    const studentId = getRandom(0, studentCount)

    const locationCount = (await getLocations(db)).length
    const sourceId = getRandom(0, locationCount)
    const destinationId = getRandom(0, locationCount)

    await insertPass(db, toDb([{
      studentId,
      sourceId,
      destinationId,
      startTime: DateTime.now().toISO(),
      durationMinutes: getRandom(1, 10),
    }])[0])
  }
}

/**
 * Ends a random active pass.
 */
export const endPass = async (db: Database<sqlite3.Database, sqlite3.Statement>) => {
  const activePasses = await getPasses(db, {where: [{column: 'end_time', restriction: 'is null'}]})
  const pass = activePasses[getRandom(0, activePasses.length - 1)]

  if (activePasses.length > 2) {
    await updatePass(db, {
      changes: toDb([{endTime: DateTime.now().toISO()}])[0],
      where: [{column: 'id', restriction: ` = ${pass.id}`}],
    })
  }
}
