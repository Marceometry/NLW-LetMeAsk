import { Link, useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import toast, { Toaster } from 'react-hot-toast'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { CustomModal } from '../components/CustomModal'

import logoImg from '../assets/images/logo.svg'
import dangerImg from '../assets/images/danger.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'

import '../css/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const [isPermissionLoading, setIsPermissionLoading] = useState(true)
  const [closeRoomModalId, setCloseRoomModalId] = useState('')
  const [questionModalId, setQuestionModalId] = useState('')
  const params = useParams<RoomParams>()
  const history = useHistory()
  const roomId = params.id
  const { questions, title, isRoomLoading } = useRoom(roomId)
  const { user, isUserLoading } = useAuth()

  useEffect(() => {
    async function getAuthorId() {
      if (!user) { return history.replace(`/rooms/${roomId}`) }

      const roomRef = await database.ref(`rooms/${roomId}`).get()

      const authorId = roomRef.val().authorId

      if (authorId !== user?.id) {
        history.replace(`/rooms/${roomId}`)
      } else {
        setIsPermissionLoading(false)
      }
    }

    if (!isUserLoading) getAuthorId()
  }, [roomId, user, history, isUserLoading])

  if (isPermissionLoading || isRoomLoading) return <div className="loaderContainer loaderScreen"><div className="loader"></div></div>

  async function handleCloseRoom() {
    const closedRoom = database.ref(`rooms/${roomId}`).update({
      closedAt: new Date()
    })

    await toast.promise(closedRoom, {
      loading: 'Carregando...',
      success: 'Sala encerrada com sucesso :)',
      error: 'Algo deu errado :,(',
    })

    history.push("/")
  }

  async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
    const deletedQuestion = database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered
    })

    toast.promise(deletedQuestion, {
      loading: 'Carregando...',
      success: `Pergunta ${isAnswered ? 'des' : ''}marcada${!isAnswered ? ' como respondida' : ''} :)`,
      error: `Algo deu errado :,(`,
    })
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    const highlightQuestion = database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted
    })

    toast.promise(highlightQuestion, {
      loading: 'Carregando...',
      success: `${isHighlighted ? 'Destaque removido' : 'Pergunta destacada'} :)`,
      error: `Algo deu errado :,(`,
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    setQuestionModalId('')
    const deleteQuestion = database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    toast.promise(deleteQuestion, {
      loading: 'Carregando...',
      success: 'Pergunta excluída com sucesso :)',
      error: 'Algo deu errado :,(',
    })
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="LetMeAsk" />
          </Link>

          <div>
            <RoomCode code={roomId} />
            <Button onClick={() => setCloseRoomModalId(roomId)} isOutlined>Encerrar sala</Button>

            <CustomModal
              id={roomId}
              isOpen={closeRoomModalId}
              setIsOpen={setCloseRoomModalId}
              imgSrc={dangerImg}
              contentLabel="Encerrar sala"
              title="Encerrar sala"
              description="Tem certeza de que você deseja encerrar esta sala?"
            >
              <button onClick={() => setCloseRoomModalId('')}>Cancelar</button>
              <button onClick={handleCloseRoom} className="confirm" >Encerrar</button>
            </CustomModal>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.length > 0 ? (
          <ul className="question-list">
            {questions.map(question => (
              <Question
                key={question.id}
                author={question.author}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  type="button"
                  className="answer-question"
                  aria-label={`${!question.isAnswered ? 'Marcar pergunta como respondida' : 'Remover marcação de respondida'}`}
                  onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {!question.isAnswered && (
                  <button
                    type="button"
                    className="highlight-question"
                    aria-label={`${!question.isHighlighted ? 'Dar destaque à pergunta' : 'Tirar destaque da pergunta'}`}
                    onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  className="delete-question"
                  aria-label="Excluir pergunta"
                  onClick={() => setQuestionModalId(question.id)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <CustomModal
                  id={question.id}
                  isOpen={questionModalId}
                  setIsOpen={setQuestionModalId}
                  imgSrc={dangerImg}
                  contentLabel="Excluir pergunta"
                  title="Excluir pergunta"
                  description="Tem certeza de que você deseja excluir esta pergunta?"
                >
                  <button onClick={() => setQuestionModalId('')}>Cancelar</button>
                  <button onClick={() => handleDeleteQuestion(question.id)} className="confirm" >Excluir</button>
                </CustomModal>
              </Question>
            ))}
          </ul>
        ) : (
          <div className="empty-questions">
            <img src={emptyQuestionsImg} alt="Ilustração" />

            <h2>Nenhuma pergunta por aqui...</h2>
            <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
          </div>
        )}
      </main>
    </div>
  )
}
