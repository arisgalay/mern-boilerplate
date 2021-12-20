import UserItem from './UserItem'
import './userlist.css'
const UserList = (props) => {
    return props.items.length == 0 ? (
        <h3>No items found</h3>
    ) : (
        <ul className="users-list">
            {props.items.map((user) => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    places={user.places}
                />
            ))}
        </ul>
    )
}

export default UserList
