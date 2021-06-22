import { useHistory } from "react-router-dom"

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { Button } from '../components/Button'
import '../styles/auth.scss'
import useAuth from "../hooks/useAuth"


export const Home = () => {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  async function navigateToNewRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    history.push("/rooms/new")
  }

  return (<div id="page-auth">
    <aside>
      <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
      <strong>Toda pergunta tem uma resposta.</strong>
      <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
    </aside>
    <main>
      <div className="main-content">
        <img src={logoImg} alt="Letmeask" />
        <button onClick={navigateToNewRoom} className="create-room">
          <img src={googleIconImg} alt="Logo do google" />
          Criar sua sala com o Google
        </button>
        <div className="separator">ou entre em uma sala</div>
        <form>
          <input
            type="text"
            placeholder="Digite o código da sala"
          />
          <Button type="submit">
            Entrar na sala
          </Button>
        </form>
      </div>
    </main>
  </div>)
}