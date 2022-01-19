import { useEffect, useState } from 'react'
import { useHttpClient } from '../../shared/hooks/http-hook'
import UserList from '../components/UserList'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

const User = () => {
  // const USER = [
  //     {
  //         id: 'u1',
  //         image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  //         name: 'Risx',
  //         places: placeLength,
  //     },
  // ]
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedUsers, setLoadedUsers] = useState()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users')
        setLoadedUsers(responseData)
      } catch (err) {}
    }

    fetchUsers()
  }, [sendRequest])

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </>
  )
}

export default User
