import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { firebase, auth } from "../services/firebase"

type UserFromGoogle = {
    uid: string | null
    displayName: string | null
    photoURL: string | null
}

type User = {
    id: string
    name: string
    avatar: string
}

type AuthContextType = {
    user: User | undefined
    isUserLoading: boolean
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [isUserLoading, setIsUserLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUserInfo(user)
            }
        })

        setIsUserLoading(false)
        
        return () => {
            unsubscribe()
        }
    }, [])
    
    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        
        const result = await auth.signInWithPopup(provider)
        
        result.user && setUserInfo(result.user)
    }

    function setUserInfo(user: UserFromGoogle) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL || !uid) {
            throw new Error('Missing information from Google Account.')
        }

        setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
        })
        
        setIsUserLoading(false)
    }

    return (
        <AuthContext.Provider value={{signInWithGoogle, user, isUserLoading}}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}