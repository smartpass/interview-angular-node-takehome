interface Common {
  name: string
  icon: string
}

export interface Retrieve extends Common {
  id: number
}

export interface Create extends Common {}

export interface Update extends Partial<Common> {
  id: number
}
