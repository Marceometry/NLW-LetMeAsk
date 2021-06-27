import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import toast, { Toaster } from 'react-hot-toast'

import { Button } from '../components/Button'
import { CustomModal } from '../components/CustomModal'
import { ToggleThemeButton } from '../components/ToggleThemeButton'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../css/auth.scss'

export function NewRoom() {
    const { signInWithGoogle, user, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [signOutModal, setSignOutModal] = useState('')
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    function handleSignOut() {
      setSignOutModal('')
      signOut()
    }

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim() === '') return

        const button = document.querySelector('form button')
        if (button) {
            button.innerHTML = 'Carregando...'
        }

        if (!user) {
            await signInWithGoogle()
            if (button) {
                button.innerHTML = 'Criar sala'
            }
            return
        }

        const roomRef = database.ref('rooms')
        const firebaseRoom = await roomRef.push({
            title: newRoom.trim(),
            admin: user,
        })

        if (firebaseRoom.key) {
            history.push(`/admin/rooms/${firebaseRoom.key}`)
        } else {
            toast.error('Algo deu errado na criação da sala.')
            if (button) {
                button.innerHTML = 'Criar sala'
            }
        }
    }

    return (
        <div id="page-auth">
            <Toaster toastOptions={{
                className: 'hot-toasts'
            }} />
            <aside>
                <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <ToggleThemeButton className="up-button toggle-theme-button" currentTheme={theme} onClick={toggleTheme} />
                
                {user && (
                    <>
                    <button
                        aria-label="Deslogar"
                        title="Deslogar" onClick={() => setSignOutModal(user.id)}
                        className="up-button home-sign-out-button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    </button>

                    <CustomModal
                        isOpen={signOutModal}
                        setIsOpen={setSignOutModal}
                        contentLabel="Deslogar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>

                        <h2>Deslogar</h2>
                        <p>Tem certeza de que você deseja se deslogar agora?</p>

                        <div className="buttons">
                            <button onClick={() => setSignOutModal('')}>Cancelar</button>
                            <button onClick={handleSignOut} className="confirm" >Deslogar</button>
                        </div>
                </CustomModal>
                    </>
                )}

                <div className="main-content">
                    <img src={logoImg} alt="LetMeAsk" />

                    <div className="separator">ou entre em uma sala</div>

                    <h2>Criar uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>

                    <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>.</p>
                </div>
            </main>
        </div>
    )
}