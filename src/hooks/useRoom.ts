import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { database } from "../services/firebase"


type QuestionType = {
    id: string
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likeId: string | undefined
    likeCount: number
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
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [isRoomLoading, setisRoomLoading] = useState(true)
    const [title, setTitle] = useState('')
    const { user } = useAuth()

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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsetQuestions)
            setisRoomLoading(false)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return { questions, title, isRoomLoading }
}