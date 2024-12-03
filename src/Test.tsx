import useWebSocket from "react-use-websocket";
import {useEffect} from "react";

const Test = () => {
  const {lastJsonMessage, sendJsonMessage} = useWebSocket(
    "wss://competitions.webository.ru/connect_stand?token=abcdABCD&type=registration&id=reg",
    {
      share: true,
      reconnectAttempts: 5
    }
  )

  sendJsonMessage({
    "event": "USERS:GET_COUNT",
    "data": null
  })

  useEffect(() => {
    if (lastJsonMessage === null) return

    switch (lastJsonMessage.event) {
      case "USERS:GET_COUNT:RESULT":
        console.log(lastJsonMessage.data.count)
    }

  }, [lastJsonMessage]);


  return (
    <div>

    </div>
  )
}

export default Test