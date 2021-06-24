import { ReactNode } from 'react'
import './style.scss'

type QuestionProps = {
    children?: ReactNode
    content: string
    author: {
        name: string
        avatar: string
    }
}

export function Question({ content, author, children }: QuestionProps) {
    return (
        <li className="question">
            <p>{ content }</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </li>
    )
}