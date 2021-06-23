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
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            user && setUserInfo(user)
        })

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
    }

    return (
        <AuthContext.Provider value={{signInWithGoogle, user}}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}