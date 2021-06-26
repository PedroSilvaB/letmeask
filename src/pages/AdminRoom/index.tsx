import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom'
import cx from 'classnames'

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

  async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered,
      isHighligthted: false
    })

  }

  async function handleHighligthQuestion(questionId: string, isHighligthted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighligthted: !isHighligthted
    })
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
          {questions.map(({ id, author, content, isAnswered, isHighligthted }) =>
            <Question
              key={id}
              author={author}
              content={content}
              isAnswered={isAnswered}
              isHighligthted={isHighligthted}
            >
              <button
                type="button"
                className={cx({ answered: isAnswered })}
                onClick={() => handleCheckQuestionAsAnswered(id, isAnswered)}
                aria-label="Marcar a pergunta como respondida"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {!isAnswered && <button
                type="button"
                className={cx({ highligthted: isHighligthted && !isAnswered })}
                onClick={() => handleHighligthQuestion(id, isHighligthted)}
                aria-label="Dar destaque à pergunta"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>}

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