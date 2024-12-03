interface UserInPlace {
  id: number,
  name: string
  surname: string
  role: {
    id: number
    name: string
  }
  competition: {
    id: number
    name: string
  } | null
}

type WebSocketMessage =
  | {
      event: "USERS:NEW_IN_PLACE"
      data: UserInPlace
    }
  | {
      event: "USERS:GET_COUNT:RESULT"
      data: {
        count: number
      }
    }
  | {
      event: "USERS:COUNT_UPDATE"
      data: {
        count: number
      }
    }
  | {
      event: "USERS:GET_IN_PLACE:RESULT"
      data: {
        users: UserInPlace[]
      }
    }
  | {
      event: "COMPETITIONS:STATE_CHANGE"
      data: {
        state: {
          id: number
          title: string
          type: string
        }
      }
    }

export type {
  WebSocketMessage
}