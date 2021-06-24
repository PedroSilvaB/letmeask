import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import { Button } from '../../components/Button';
import { Question } from '../../components/Question';

import { RoomCode } from '../../components/RoomCode';
//import useAuth from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import "../../styles/room.scss"
import { database } from '../../services/firebase';

type RoomParams = {
  id: string
}

export const AdminRoom = () => {
  const history = useHistory()
  const params = useParams<RoomParams>()
  //const { user } = useAuth()

  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que vôce deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img onClick={() => history.push("/")} src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map(({ id, author, content }) =>
            <Question
              key={id}
              author={author}
              content={content} >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          )}
        </div>
      </main>
    </div>
  );
}