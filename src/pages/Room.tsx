import { FormEvent, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import logoImg from '../assets/images/logo.svg'
import '../css/room.scss'

type FirebaseQuestions = Record<string, {
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    author: {
        name: string
        avatar: string
    }
}>

type QuestionType = {
    id: string
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    author: {
        name: string
        avatar: string
    }
}

type RoomParams = {
    id: string
}

export function Room() {
    const [newQuestion, setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parsetQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsetQuestions)
        })
    }, [roomId])

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

                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
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
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        
                        <Button type="submit" disabled={!user} >Enviar pergunta</Button>
                    </div>
                </form>

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