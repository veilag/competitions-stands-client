import HyperText from "../components/ui/hyper-text.tsx";
import {Label} from "../components/ui/label.tsx";
import {Input} from "../components/ui/input.tsx";
import {Button} from "../components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import useAuthStore from "../store";

const AuthView = () => {
  const navigate = useNavigate()
  const [standType, setStandType] = useState("")

  const token = useAuthStore(state => state.token)
  const setToken = useAuthStore(state => state.setToken)
  const id = useAuthStore(state => state.id)
  const setId = useAuthStore(state => state.setId)

  const onClick = () => {
    switch (standType) {
      case "registration":
        console.log(token)
        navigate("/registration")
        break

      case "interactive":
        navigate("/interactive")
        break

      case "awarding":
        navigate("/awarding")
        break
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div>
        <div className="flex flex-col mb-10 items-center">
          <HyperText
            className="font-black text-3xl"
            text="IT Олимпиады 2024"
          />
          <HyperText
            className="font-semibold text-xl"
            text="Авторизация стенда"
          />
        </div>

        <div>
          <div>
            <Label htmlFor="token">Токен авторизации</Label>
            <Input type="password" value={token} onChange={e => setToken(e.target.value)} id="token"/>
          </div>

          <div className="mt-3">
            <Label htmlFor="type">Вид стенда</Label>

            <Select onValueChange={value => setStandType(value)}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="registration">Регистрационный</SelectItem>
                  <SelectItem value="interactive">Интерактивный с GPT</SelectItem>
                  <SelectItem value="awarding">Розыгрыш</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3">
            <Label htmlFor="id">Уникальный ID</Label>
            <Input value={id} onChange={e => setId(e.target.value)} id="id"/>
          </div>

          <Button onClick={onClick} className="w-full mt-3">Авторизовать</Button>
        </div>
      </div>
    </div>
  )
}

export default AuthView