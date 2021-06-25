import { ReactNode } from 'react'
import cx from 'classnames'
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
        <li className={cx(
            'question',
            {answered: isAnswered},
            {highlighted: isHighlighted && !isAnswered}
        )}>
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