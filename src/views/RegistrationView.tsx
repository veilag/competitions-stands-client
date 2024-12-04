import HyperText from "../components/ui/hyper-text.tsx";
import Globe from "../components/ui/globe.tsx";
import DotPattern from "../components/ui/dot-pattern.tsx";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useEffect, useState} from "react";
import useAuthStore from "../store";
import {AnimatePresence, motion} from "framer-motion";
import {WebSocketMessage} from "@/types";
import {WS_ROOT} from "@/config/constants.ts";

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

interface CompetitionState {
  id: number
  name: string
  type: string
}

const RegistrationView = () => {
  const [users, setUsers] = useState<UserInPlace[]>([])
  const [userCount, setUserCount] = useState<number>(0)

  const token = useAuthStore(state => state.token)
  const id = useAuthStore(state => state.id)

  const [connectionState, setConnectionState] = useState<string>("")
  const [competitionState, setCompetitionState] = useState<CompetitionState | undefined>(undefined)

  const {lastJsonMessage, readyState, sendJsonMessage} = useWebSocket<WebSocketMessage | null>(`${WS_ROOT}/connect_stand?token=${token}&id=${id}&type=registration`, {
    reconnectAttempts: 5,
    shouldReconnect: () => true,
    onOpen: () => {
      sendJsonMessage({
        "event": "USERS:GET_COUNT",
        "data": null
      })

      sendJsonMessage({
        "event": "USERS:GET_IN_PLACE",
        "data": null
      })

      sendJsonMessage({
        event: "COMPETITIONS:GET_STATE",
        data: null
      })
    }
  })

  const color =
    (competitionState?.type === "registration" && "bg-blue-500") ||
    (competitionState?.type === "task_solving" && "bg-green-500") ||
    (competitionState?.type === "start" && "bg-neutral-500") ||
    (competitionState?.type === "awarding" && "bg-red-500") ||
    (competitionState?.type === "checking" && "bg-yellow-500") ||
    (competitionState?.type === "end" && "bg-neutral-500") ||
    ((competitionState?.type === "lunch" || competitionState?.type === "breakfast" || competitionState?.type === "dinner") && "bg-orange-500") ||
    undefined

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:NEW_IN_PLACE":
        setUsers(prev => ([...prev, {
          id: lastJsonMessage.data.id,
          name: lastJsonMessage.data.name,
          surname: lastJsonMessage.data.surname,
          role: {
            id: lastJsonMessage.data.role.id,
            name: lastJsonMessage.data.role.name
          },
          competition: lastJsonMessage.data.competition && {
            id: lastJsonMessage.data.competition.id,
            name: lastJsonMessage.data.competition.name
          }
        }]))
        break

      case "USERS:GET_COUNT:RESULT":
        setUserCount(lastJsonMessage.data.count)
        break

      case "USERS:COUNT_UPDATE":
        setUserCount(lastJsonMessage.data.count)
        break

      case "USERS:GET_IN_PLACE:RESULT":
        setUsers(lastJsonMessage.data.users)
        break

      case "COMPETITIONS:STATE_CHANGE":
        setCompetitionState(lastJsonMessage.data.state)
        break

      case "COMPETITIONS:GET_STATE:RESULT":
        setCompetitionState(lastJsonMessage.data.state)
    }
  }, [lastJsonMessage])

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionState("Идет подключение к серверу")
        break

      case ReadyState.OPEN:
        setConnectionState("Подключено к серверу")
        break

      case ReadyState.CLOSED:
        setConnectionState("Соединение разорвано")
        break
    }

  }, [readyState])

  return (
    <>
      <div className="relative gap-32 w-full h-screen flex p-12">
        <DotPattern className="fill-neutral-300 z-0"/>

        <div className="flex z-10 flex-col justify-between">
          <div>
            <div className="bg-black p-8 text-white">
              <HyperText
                className="text-5xl font-black"
                text="IT Олимпиады 2024"
              />
              <HyperText
                className="text-xl mt-2 font-bold"
                text="Добро пожаловать на олимпиаду!"
              />
              <div className="flex mt-6 items-center gap-2">
                {connectionState === "Соединение разорвано" && (
                  <div className="relative flex justify-center items-center">
                    <span className="block rounded-full w-2 h-2 bg-red-500"></span>
                  </div>
                )}
                {connectionState === "Идет подключение к серверу" && (
                  <div className="relative flex justify-center items-center">
                    <span className="block rounded-full w-2 h-2 bg-orange-500"></span>
                  </div>
                )}
                {connectionState === "Подключено к серверу" && (
                  <div className="relative flex justify-center items-center">
                    <span className="block animate-ping rounded-full w-4 h-4 bg-green-400 absolute"></span>
                    <span className="block rounded-full w-2 h-2 bg-green-400"></span>
                  </div>
                )}
                <p>{connectionState}</p>
              </div>
            </div>

            {competitionState && (
              <div className={`text-2xl ${color} text-white w-fit px-3 py-1 mt-4 font-bold`}>
                <HyperText
                  className="text-2xl font-medium"
                  text={competitionState.name}
                />
              </div>
            )}
          </div>

          <div>
            <HyperText
              className="text-3xl font-bold"
              text="Участников пришло"
            />
            <HyperText
              className="text-2xl mb-4 font-medium"
              text="Покажите QR-код у входа"
            />

            <p className="text-9xl font-bold">
              <span className="text-green-500">{users.length}</span>
              <span className="text-neutral-400">/{userCount}</span>
            </p>
          </div>
        </div>

        <div className="z-10">
          {users.length !== 0 && (
            <div className="px-4 py-3 bg-black text-white w-fit mb-7">
              <HyperText
                className="text-2xl font-bold"
                text="Приветствуем"
              />
            </div>
          )}

          <ul className="flex flex-col-reverse justify-start gap-6">
            <AnimatePresence mode="popLayout">
              {users.map((user, index) => (
                <motion.li
                  layout
                  key={index}
                  initial={{
                    height: 0
                  }}
                  animate={{
                    height: 100,
                  }}
                >
                  <HyperText
                    className="text-lg font-bold text-neutral-400"
                    text={user.role.name}
                  />
                  <HyperText
                    className="text-4xl font-bold"
                    text={`${user.surname} ${user.name}`}
                  />
                  {user.competition && (
                    <HyperText
                      className="text-2xl font-bold text-neutral-500"
                      text={user.competition.name}
                    />
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <Globe className={`z-40 left-[60%] top-[60%] transition-all ease-in-out duration-500 scale-150`}/>
      </div>
    </>
  )
}

export default RegistrationView