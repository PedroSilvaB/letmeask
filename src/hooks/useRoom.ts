import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import useAuth from "./useAuth"

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighligthted: boolean,
  isAnswered: boolean,
  createAt: Date,
  likes: Record<string, {
    authorId: string
  }>
}>

type QuestionType = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isHighligthted: boolean,
  isAnswered: boolean,
  createAt: Date,
  likeCount: number,
  likeId: string | undefined,
  likeUid: string | undefined
}

export const useRoom = (roomId: string) => {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState("")
  const [authorIdRoom, setAuthorIdRoom] = useState()
  const [closedRoom, setClosedRoom] = useState<boolean>()


  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {

        return {
          id: key,
          ...value,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, { authorId }]) => authorId === user?.id)?.[0],
          likeUid: Object.entries(value.likes ?? {}).find(([key, { authorId }]) => authorId === user?.id)?.[1]?.authorId
        }
      })
      setTitle(databaseRoom.title)
      setAuthorIdRoom(databaseRoom.authorId)
      setClosedRoom(!!databaseRoom?.endedAt)
      setQuestions(parsedQuestions)

    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return {
    questions,
    title,
    authorIdRoom,
    closedRoom
  }
}