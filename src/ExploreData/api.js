import { useEffect } from 'react'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { usersAtom } from './state'
const API_URL = process.env.REACT_APP_API_URL
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: ACCESS_TOKEN,
  },
})

const getAllUsers = async (users = [], offset = 0) => {
  console.log('getAllUsers', users.length, offset)
  const response = await api.get(`/analytics/users?limit=100&offset=${offset}`)

  if (!response.data.length) {
    return users
  }

  return getAllUsers([...users, ...response.data], offset + 1)
}

export const useUsers = () => {
  const [users, setUsers] = useRecoilState(usersAtom)

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUsers()
      setUsers(users)
    }
    getUsers()
  }, [setUsers])

  return users
}
