import { useEffect, useState } from "react"
import { database } from "../services/firebase"


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

type FirebaseQuestions = Record<string, {
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    author: {
        name: string
        avatar: string
    }
}>

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

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

    return { questions, title }
}