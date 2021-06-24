import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import { Button } from '../components/Button'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../css/auth.scss'
import { database } from '../services/firebase'
import { useAuth } from '../contexts/AuthContext'

export function NewRoom() {
    const { user } = useAuth()
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim() === '') return

        const roomRef = database.ref('rooms')
        const firebaseRoom = await roomRef.push({
            title: newRoom.trim(),
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
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