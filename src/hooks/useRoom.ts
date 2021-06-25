import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { database } from "../services/firebase"

type Admin = {
    id: string
    name: string
    avatar: string
}

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
    const [isRoomLoading, setIsRoomLoading] = useState(true)
    const [roomNotFound, setRoomNotFound] = useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const [title, setTitle] = useState('')
    const [admin, setAdmin] = useState({} as Admin)
    const { user } = useAuth()

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val()

            if (!databaseRoom) {
                setRoomNotFound(true)
                setIsRoomLoading(false)
                return
            }
            
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

            setIsClosed(databaseRoom.closedAt)
            setTitle(databaseRoom.title)
            setAdmin(databaseRoom.admin)
            setQuestions(parsetQuestions)
            setIsRoomLoading(false)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return { questions, title, admin, isRoomLoading, isClosed, roomNotFound }
}