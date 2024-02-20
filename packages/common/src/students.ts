export type Grade = 'k' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'

interface Common {
  name: string
  profilePictureUrl: string
  grade: Grade
}

export interface Retrieve extends Common {
  id: number
}

export interface Create extends Common {}

export interface Update extends Partial<Common> {
  id: number
}
