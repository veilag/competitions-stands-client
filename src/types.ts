type WebSocketMessage =
  | {
      event: "NEW_USER_IN_PLACE"
      data: {
        name: string
        surname: string
        competition: string
      }
    }

export type {
  WebSocketMessage
}