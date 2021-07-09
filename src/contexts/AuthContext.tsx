import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";

import { auth, firebase } from "../services/firebase"

type UseData = {
  id: string,
  name: string,
  avatar: string
}
type AuthContextData = {
  user: UseData | undefined,
  loading: boolean,
  signInWithGoogle: () => Promise<void>
}
export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UseData>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error("Missing information form Google Account.")
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error("Missing information form Google Account.")
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  )
}