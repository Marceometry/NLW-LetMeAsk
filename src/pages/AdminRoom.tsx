import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import logoImg from '../assets/images/logo.svg'
import '../css/room.scss'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const [newQuestion, setNewQuestion] = useState('')
    const params = useParams<RoomParams>()
    const roomId = params.id
    const { questions, title } = useRoom(roomId)
    const { user } = useAuth()

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if (newQuestion.trim() === '') return
        if (!user) {
            throw new Error('Você precisa estar logado para enviar uma pergunta.')
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

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />

                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <ul className="question-list">
                    {questions.map(question => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        />
                    ))}
                </ul>
            </main>
        </div>
    )
}