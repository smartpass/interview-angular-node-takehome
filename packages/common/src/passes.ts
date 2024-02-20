interface Common {
  studentId: number
  sourceId: number
  destinationId: number
  startTime: string
  durationMinutes: number
  endTime?: string
}

export interface Retrieve extends Common {
  id: number
}

export interface Create extends Common {
  endTime?: never
}

export interface Update extends Partial<Common> {
  id: number
}
