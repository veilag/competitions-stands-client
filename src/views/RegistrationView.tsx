import HyperText from "../components/ui/hyper-text.tsx";
import Globe from "../components/ui/globe.tsx";
import DotPattern from "../components/ui/dot-pattern.tsx";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {WS_ROOT} from "../constants.ts"
import {useEffect, useState} from "react";
import useAuthStore from "../store";
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import {WebSocketMessage} from "@/types";

interface UserInPlace {
  name: string
  surname: string
  competition: string
}

const RegistrationView = () => {
  const navigate = useNavigate()
  const [isError, setError] = useState<boolean>(false)

  const [users, setUsers] = useState<UserInPlace[]>([])

  const token = useAuthStore(state => state.token)
  const id = useAuthStore(state => state.id)

  const [connectionState, setConnectionState] = useState<string>("")
  const {lastJsonMessage, readyState} = useWebSocket<WebSocketMessage | null>(`${WS_ROOT}/connect_stand?token=${token}&id=${id}&type=registration`, {
    onError: () => {
      setError(true)
    }
  })

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "NEW_USER_IN_PLACE":
        setUsers(prev => ([...prev, {
          name: lastJsonMessage.data.name,
          surname: lastJsonMessage.data.surname,
          competition: lastJsonMessage.data.competition
        }]))
    }
  }, [lastJsonMessage])

  useEffect(() => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        setConnectionState("Идет подключение к серверу...")
        break

      case ReadyState.OPEN:
        setConnectionState("Подключено к серверу")
        break

      case ReadyState.CLOSED:
        setConnectionState("Соединение разорвано")
    }

  }, [readyState])

  return (
    <>
      {isError && (
        <div className="z-50 flex justify-center items-center absolute w-full h-screen">
          <div className="z-0 absolute w-full h-screen bg-neutral-600 opacity-50"></div>
          <div
            onClick={() => {
              navigate("/")
            }}
            className="z-50 p-10 bg-white text-black cursor-pointer"
          >
            <p className="text-xl font-medium">Во время подключения к серверу произошла ошибка</p>
            <p>Проверьте данные подключения</p>
          </div>
        </div>
      )}

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
                <div className="relative flex justify-center items-center">
                  <span className="block animate-ping rounded-full w-4 h-4 bg-green-400 absolute"></span>
                  <span className="block rounded-full w-2 h-2 bg-green-400"></span>
                </div>
                <p>{connectionState}</p>
              </div>
            </div>
          </div>

          <div>
            <HyperText
              className="text-2xl font-bold"
              text="Участников пришло"
            />
            <HyperText
              className="text-xl mb-4 font-bold"
              text="Покажите QR-код у входа"
            />

            <p className="text-8xl font-bold">
              <span className="text-green-500">{users.length}</span>
              <span className="text-neutral-400">/30</span>
            </p>
          </div>
        </div>

        <div className="z-10">
          {users.length !== 0 && (
            <div className="p-4 bg-black text-white w-fit mb-7">
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
                    height: 72,
                  }}
                >
                  <HyperText
                    className="text-4xl font-bold"
                    text={`${user.surname} ${user.name}`}
                  />
                  <HyperText
                    className="text-2xl font-bold text-neutral-500"
                    text={user.competition}
                  />
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