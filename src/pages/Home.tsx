import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import signOutImg from '../assets/images/sign-out.svg'
import logoImg from '../assets/images/logo.svg'

import '../css/auth.scss'
import { CustomModal } from '../components/CustomModal'

export function Home() {
    const history = useHistory()
    const { signInWithGoogle, user, signOut } = useAuth()
    const [roomCode, setRoomCode] = useState('')
    const [signOutModal, setSignOutModal] = useState('')

    function handleSignOut() {
      signOut()
    }

    async function handleCreateRoom() {
        !user && await signInWithGoogle()
        
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') return

        const button = document.querySelector('form button')
        if (button) {
            button.innerHTML = 'Carregando...'
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if (!roomRef.exists()) {
            toast.error('Esta sala não foi encontrada.')
            if (button) {
                button.innerHTML = 'Entrar na sala'
            }
            return
        }

        if (roomRef.val().closedAt) {
            toast.error('Esta sala já fechou.')
            if (button) {
                button.innerHTML = 'Entrar na sala'
            }
            return
        }

        history.push(`/rooms/${roomCode}`)
    }

    return (
        <div id="page-auth">
            <Toaster />
            <aside>
                <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                {user && (
                    <>
                    <button aria-label="Deslogar" title="Deslogar" onClick={() => setSignOutModal(user.id)} className="home-sign-out-button">
                        Botão provisório para deslogar
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
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

                <div className="main-content">
                    <img src={logoImg} alt="LetMeAsk" />

                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="separator">ou entre em uma sala</div>

                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}