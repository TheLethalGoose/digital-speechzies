export type MessageType = 'text' | 'audio'

export interface BaseMessage {
  type: MessageType
  from: 'me' | 'other'
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  text: string
  bold?: boolean
}

export interface AudioMessage extends BaseMessage {
  type: 'audio'
  src: string
}

export type Message = TextMessage | AudioMessage

export interface MessagesByPage {
  [page: string]: Message[]
}