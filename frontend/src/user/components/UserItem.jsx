import './useritem.css'
const UserItem = (props) => {
    return (
        <li className="user-item">
            <div className="user-item___content">
                <div className="user-item__image">
                    <img src={props.image} alt={props.name} />
                </div>
                <div className="user-item___info">
                    <h2>{props.name}</h2>
                    <h3>
                        {props.places} {props.places === 1 ? 'Place' : 'Places'}
                    </h3>
                </div>
            </div>
        </li>
    )
}

export default UserItem
