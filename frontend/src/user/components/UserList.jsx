import UserItem from './UserItem'
import Card from '../../shared/components/UIElements/Card'
import './userlist.css'
const UserList = (props) => {
    return props.items.length == 0 ? (
        <div className="users-list">
            <Card>
                <h3>No User's found</h3>
            </Card>
        </div>
    ) : (
        <ul className="users-list">
            {props.items.map((user) => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={
                        user.image ||
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                    }
                    name={user.name}
                    placeCount={user.places.length}
                />
            ))}
        </ul>
    )
}

export default UserList
