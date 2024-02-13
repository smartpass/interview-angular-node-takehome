export interface NoopMessage {
  op: 'noop'
  data: string
}

export interface EchoMessage {
  op: 'echo'
  data: string
}

export type ClientMessage = NoopMessage | EchoMessage

export type ServerMessage = EchoMessage
