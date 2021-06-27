import { Link, useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import { useTheme } from '../contexts/ThemeContext'
import toast, { Toaster } from 'react-hot-toast'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { CustomModal } from '../components/CustomModal'
import { UserInfo } from '../components/UserInfo'
import { Header } from '../components/Header'
import { ToggleThemeButton } from '../components/ToggleThemeButton'

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
  const [deleteQuestionModalId, setDeleteQuestionModalId] = useState('')
  const [signOutModal, setSignOutModal] = useState('')
  const [enterAsUserModal, setEnterAsUserModal] = useState('')
  
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title, admin, isRoomLoading } = useRoom(roomId)
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    async function getAuthorId() {
      if (!user) { return history.replace(`/rooms/${roomId}`) }

      if (admin.id !== user?.id) {
        history.replace(`/rooms/${roomId}`)
      } else {
        setIsPermissionLoading(false)
      }
    }

    if (!isRoomLoading) getAuthorId()
  }, [roomId, user, history, isRoomLoading, admin])

  if (isPermissionLoading || isRoomLoading) return (
    <>
    <Header />
    <div className="loaderContainer"><div className="loader"></div></div>
    </>
  )

  function handleEnterAsCommonUser() {
    history.push(`/rooms/${roomId}`)
  }

  function handleSignOut() {
    signOut()
  }

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

    await toast.promise(deletedQuestion, {
      loading: 'Carregando...',
      success: `Pergunta ${isAnswered ? 'des' : ''}marcada${!isAnswered ? ' como respondida' : ''} :)`,
      error: `Algo deu errado :,(`,
    })
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    const highlightQuestion = database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted
    })

    await toast.promise(highlightQuestion, {
      loading: 'Carregando...',
      success: `${isHighlighted ? 'Destaque removido' : 'Pergunta destacada'} :)`,
      error: `Algo deu errado :,(`,
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    setDeleteQuestionModalId('')
    
    const deleteQuestion = database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    
    await toast.promise(deleteQuestion, {
      loading: 'Carregando...',
      success: 'Pergunta excluída com sucesso :)',
      error: 'Algo deu errado :,(',
    })
  }

  return (
    <div id="page-room">
      <Toaster toastOptions={{
          className: 'hot-toasts'
      }} />
      <header>
        <div className="content">
          <div className="left-header-div">
            <Link to="/">
              <img src={logoImg} alt="LetMeAsk" />
            </Link>

            <ToggleThemeButton currentTheme={theme} onClick={toggleTheme} />

            <button aria-label="Entrar como usuário comum" title="Entrar como usuário comum" disabled={!user} onClick={() => setEnterAsUserModal('1')}>
              <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M17,11c0.34,0,0.67,0.04,1,0.09V6.27L10.5,3L3,6.27v4.91c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55 C11.41,19.47,11,18.28,11,17C11,13.69,13.69,11,17,11z" /><path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38c0.62,0,1.12,0.51,1.12,1.12 s-0.51,1.12-1.12,1.12s-1.12-0.51-1.12-1.12S16.38,14.38,17,14.38z M17,19.75c-0.93,0-1.74-0.46-2.24-1.17 c0.05-0.72,1.51-1.08,2.24-1.08s2.19,0.36,2.24,1.08C18.74,19.29,17.93,19.75,17,19.75z" /></g></g></svg>
            </button>
            <CustomModal
              isOpen={enterAsUserModal}
              setIsOpen={setEnterAsUserModal}
              contentLabel="Sair do modo de administrador"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
        
              <h2>Sair do modo de administrador</h2>
              <p>Tem certeza de que você deseja sair do modo de administrador?</p>
        
              <div className="buttons">
                <button onClick={() => setEnterAsUserModal('')}>Cancelar</button>
                <button onClick={handleEnterAsCommonUser} className="confirm" >Sair</button>
              </div>
            </CustomModal>

            <button aria-label="Deslogar" title="Deslogar" className="sign-out-button" onClick={() => setSignOutModal('1')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
            </button>
            <CustomModal
              isOpen={signOutModal}
              setIsOpen={setSignOutModal}
              contentLabel="Deslogar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>

              <h2>Deslogar</h2>
              <p>Tem certeza de que você deseja se deslogar agora?</p>

              <div className="buttons">
                <button onClick={() => setSignOutModal('')}>Cancelar</button>
                <button onClick={handleSignOut} className="confirm" >Deslogar</button>
              </div>
            </CustomModal>
          </div>

          <div>
            <RoomCode code={roomId} />
            <Button onClick={() => setCloseRoomModalId(roomId)} isOutlined>Encerrar sala</Button>

            <CustomModal
              isOpen={closeRoomModalId}
              setIsOpen={setCloseRoomModalId}
              contentLabel="Encerrar sala"
            >
              <img src={dangerImg} alt="Encerrar sala" />

              <h2>Encerrar sala</h2>
              <p>Tem certeza de que você deseja encerrar esta sala?</p>

              <div className="buttons">
                <button onClick={() => setCloseRoomModalId('')}>Cancelar</button>
                <button onClick={handleCloseRoom} className="confirm" >Encerrar</button>
              </div>
            </CustomModal>
          </div>
        </div>
      </header>

      <main>
        <div className="room-header">
          <h1>Sala: {title}</h1>

          <div>
            <UserInfo name={admin.name} avatar={admin.avatar} />
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </div>
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
                  onClick={() => setDeleteQuestionModalId(question.id)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Question>
            ))}

            <CustomModal
              isOpen={deleteQuestionModalId}
              setIsOpen={setDeleteQuestionModalId}
              contentLabel="Excluir pergunta"
            >
              <img src={dangerImg} alt="Excluir pergunta" />

              <h2>Excluir pergunta</h2>
              <p>Tem certeza de que você deseja excluir esta pergunta?</p>

              <div className="buttons">
                <button onClick={() => setDeleteQuestionModalId('')}>Cancelar</button>
                <button onClick={() => handleDeleteQuestion(deleteQuestionModalId)} className="confirm" >Excluir</button>
              </div>
            </CustomModal>
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