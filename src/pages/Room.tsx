import { FormEvent, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import toast, { Toaster } from 'react-hot-toast'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { CustomModal } from '../components/CustomModal'

import logoImg from '../assets/images/logo.svg'
import adminImg from '../assets/images/admin.svg'
import signOutImg from '../assets/images/sign-out.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'

import '../css/room.scss'
import { Header } from '../components/Header'

type RoomParams = {
  id: string
}

export function Room() {
  const [newQuestion, setNewQuestion] = useState('')
  const [signOutModal, setSignOutModal] = useState('')
  const [enterAsAdminModal, setEnterAsAdminModal] = useState('')
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title, isRoomLoading, isClosed, roomNotFound } = useRoom(roomId)
  const { signInWithGoogle, signOut, user } = useAuth()

  if (isRoomLoading) return (
    <>
    <Header />
    <div className="loaderContainer"><div className="loader"></div></div>
    </>
  )

  if (roomNotFound) return (
    <>
    <Header />
    <div className="loaderContainer"><h2>Desculpe, essa sala não foi encontrada :,(</h2></div>
    </>
  )

  if (isClosed) return (
    <>
    <Header />
    <div className="loaderContainer"><h2>Desculpe, essa sala foi encerrada :,(</h2></div>
    </>
  )

  async function handleSignIn() {
    !user && await signInWithGoogle()
  }

  function handleSignOut() {
    setSignOutModal('')
    signOut()
  }

  async function handleEnterAsAdmin() {
    if (!user) return

    setEnterAsAdminModal('')

    const roomRef = await database.ref(`rooms/${roomId}`).get()

    const authorId = roomRef.val().authorId

    if (authorId !== user.id) {
      toast.error('Você precisa estar logado na conta que criou esta sala.')
    } else {
      history.push(`/admin/rooms/${roomId}`)
    }
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') return
    if (!user) {
      toast.error('Você precisa estar logado.')
      return
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    toast.success('Pergunta enviada com sucesso :)')

    setNewQuestion('')
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (!user) {
      throw new Error('Você precisa estar logado.')
    } else if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user.id,
      })
    }
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <div className="left-header-div">
            <Link to="/">
              <img src={logoImg} alt="LetMeAsk" />
            </Link>

            <button aria-label="Entrar como administrador" title="Entrar como administrador" disabled={!user} onClick={() => setEnterAsAdminModal('1')}>
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /></g><g><g><path d="M17,11c0.34,0,0.67,0.04,1,0.09V6.27L10.5,3L3,6.27v4.91c0,4.54,3.2,8.79,7.5,9.82c0.55-0.13,1.08-0.32,1.6-0.55 C11.41,19.47,11,18.28,11,17C11,13.69,13.69,11,17,11z" /><path d="M17,13c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4C21,14.79,19.21,13,17,13z M17,14.38c0.62,0,1.12,0.51,1.12,1.12 s-0.51,1.12-1.12,1.12s-1.12-0.51-1.12-1.12S16.38,14.38,17,14.38z M17,19.75c-0.93,0-1.74-0.46-2.24-1.17 c0.05-0.72,1.51-1.08,2.24-1.08s2.19,0.36,2.24,1.08C18.74,19.29,17.93,19.75,17,19.75z" /></g></g></svg>
            </button>
            <CustomModal
              isOpen={enterAsAdminModal}
              setIsOpen={setEnterAsAdminModal}
              imgSrc={adminImg}
              imgSize={'3rem'}
              contentLabel="Entrar como administrador"
              title="Entrar como administrador"
              description="Entrar como administrador? Você precisa estar logado com a conta que criou esta sala."
            >
              <button onClick={() => setEnterAsAdminModal('')}>Cancelar</button>
              <button onClick={handleEnterAsAdmin} className="confirm green" >Entrar</button>
            </CustomModal>

            {user && (
              <>
              <button aria-label="Deslogar" title="Deslogar" className="sign-out-button" onClick={() => setSignOutModal('1')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
              </button>
              <CustomModal
                isOpen={signOutModal}
                setIsOpen={setSignOutModal}
                imgSrc={signOutImg}
                imgSize={'3rem'}
                contentLabel="Deslogar"
                title="Deslogar"
                description="Tem certeza de que você deseja se deslogar agora?"
              >
                <button onClick={() => setSignOutModal('')}>Cancelar</button>
                <button onClick={handleSignOut} className="confirm" >Deslogar</button>
              </CustomModal>
              </>
            )}
          </div>

          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            autoFocus
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button onClick={handleSignIn}>faça seu login</button>.</span>
            )}

            <Button type="submit" disabled={!user || !newQuestion} >Enviar pergunta</Button>
          </div>
        </form>

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
                {!question.isAnswered && (
                  <button
                    disabled={!user}
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                    aria-label="Marcar como gostei"
                    type="button"
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </Question>
            ))}
          </ul>
        ) : (
          <div className="empty-questions">
            <img src={emptyQuestionsImg} alt="Ilustração" />

            <h2>Nenhuma pergunta por aqui...</h2>
            <p>Seja a primeira pessoa a fazer uma pergunta!</p>
          </div>
        )}
      </main>
    </div>
  )
}