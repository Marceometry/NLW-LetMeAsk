import { ReactNode } from 'react'
import { UserInfo } from '../UserInfo'
import './style.scss'

type QuestionProps = {
    children?: ReactNode
    isAnswered?: boolean
    isHighlighted?: boolean
    content: string
    author: {
        name: string
        avatar: string
    }
}

export function Question({ content, author, isAnswered = false, isHighlighted = false, children }: QuestionProps) {
    return (
        <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted && !isAnswered ? 'highlighted' : ''}`}>
            <p>{ content }</p>
            <footer>
                <UserInfo name={author.name} avatar={author.avatar} />
                <div>{children}</div>
            </footer>
        </div>
    )
}