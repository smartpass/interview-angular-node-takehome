export interface NoopMessage {
  op: 'noop'
  data: string
}

export interface EchoMessage {
  op: 'echo'
  data: string
}

export interface EventMessage {
  op: 'event'
  data: {
    event: string
    [_: string]: any
  }
}

export type ClientMessage = NoopMessage | EchoMessage

export type ServerMessage = EchoMessage | EventMessage
