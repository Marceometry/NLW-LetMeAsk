import { useState, useEffect, createContext, useContext, ReactNode } from "react"

type Theme = 'light' | 'dark'

type ThemeContextType = {
    theme: Theme
}

type ThemeContextProviderProps = {
    children: ReactNode
}

export const ThemeContext = createContext({} as ThemeContextType)

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const stogaredTheme = localStorage.getItem('theme')

        return (stogaredTheme ?? 'light') as Theme
    })

    useEffect(() => {
        localStorage.setItem('theme', currentTheme)
    }, [currentTheme])

    return (
        <ThemeContext.Provider value={{theme: currentTheme}}>
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}