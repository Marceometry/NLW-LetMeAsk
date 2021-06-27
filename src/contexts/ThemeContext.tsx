import { useState, useEffect, createContext, useContext, ReactNode } from "react"

type Theme = 'light' | 'dark'

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
}

type ThemeContextProviderProps = {
    children: ReactNode
}

export const ThemeContext = createContext({} as ThemeContextType)

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const storagedTheme = localStorage.getItem('theme')

        return (storagedTheme ?? 'light') as Theme
    })
    
    useEffect(() => {
        localStorage.setItem('theme', currentTheme)
        
        if (currentTheme === 'dark') {
            setDarkTheme()
        } else {
            setLightTheme()
        }
    }, [currentTheme])

    function toggleTheme() {
        currentTheme === 'light' ? (
            setCurrentTheme('dark')
        ) : (
            setCurrentTheme('light')
        )
    }

    function setDarkTheme() {
        const root = document.documentElement.style
        root.setProperty('--white', '#181818')
        root.setProperty('--black', '#f4f0ff')
        root.setProperty('--gray-10', '#DBDCDD')
        root.setProperty('--gray-25', '#8f8f9b')
        root.setProperty('--gray-50', '#737380')
        root.setProperty('--gray-100', '#626262')
        root.setProperty('--gray-200', '#484848')
        root.setProperty('--background', '#29292e')
        root.setProperty('--answered', '#333333')
        root.setProperty('--highlighted', '#524f5c')
    }

    function setLightTheme() {
        const root = document.documentElement.style
        root.setProperty('--white', '#ffffff')
        root.setProperty('--black', '#29292e')
        root.setProperty('--gray-25', '#737380')
        root.setProperty('--gray-50', '#a8a8b3')
        root.setProperty('--gray-100', '#cccdce')
        root.setProperty('--gray-100', '#DBDCDD')
        root.setProperty('--gray-200', '#fefefe')
        root.setProperty('--background', '#f8f8f8')
        root.setProperty('--answered', '#DBDCDD')
        root.setProperty('--highlighted', '#f4f0ff')
    }

    return (
        <ThemeContext.Provider value={{theme: currentTheme, toggleTheme}}>
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}