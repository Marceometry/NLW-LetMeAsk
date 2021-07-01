import { ButtonHTMLAttributes, useState, useEffect } from 'react'
import './style.scss'

type BackToTopButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function BackToTopButton({ ...props }: BackToTopButtonProps) {
    const [isButtonVisible, setIsButtonVisible] = useState(false)

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 250) {
                setIsButtonVisible(true)
            } else {
                setIsButtonVisible(false)
            }
        }
        window.addEventListener('scroll', scrollListener)
        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    }, [])

    function backToTop() {
        window.scrollTo(0, 0)
    }

    return (
        <button onClick={backToTop} {...props}
            className={`back-to-top-button ${isButtonVisible ? 'visible' : ''}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/></svg>
        </button>
    )
}