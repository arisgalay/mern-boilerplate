import UserList from '../components/UserList'

const User = () => {
    const USER = [
        {
            id: 1,
            image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            name: 'Risx',
            places: 3,
        },
    ]
    return <UserList items={USER} />
}

export default User
