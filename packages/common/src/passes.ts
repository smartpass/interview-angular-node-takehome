export namespace Model {
  interface Common {
    sourceId: number
    destinationId: number
    startTime: string
    duration: number
    endTime?: string
  }

  export interface Retrieve extends Common {
    id: number
  }

  export interface Create extends Common {
    endTime: undefined
  }

  export interface Update extends Partial<Common> {
    id: number
  }
}
