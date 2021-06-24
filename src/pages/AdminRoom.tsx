import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import '../css/room.scss'
import { database } from '../services/firebase'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const params = useParams<RoomParams>()
    const history = useHistory()
    const roomId = params.id
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        if (window.confirm('Are you sure you want to end this room?')) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })

            history.push("/")
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Are you sure you want to delete?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />

                    <div>
                        <RoomCode code={roomId} />
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
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
                        >
                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Excluir pergunta" />
                            </button>
                        </Question>
                    ))}
                </ul>
            </main>
        </div>
    )
}