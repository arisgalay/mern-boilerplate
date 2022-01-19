import { useContext, useState } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './placeitem.css'

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)
  const [showMap, setShowMap] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const mapToggle = () => {
    setShowMap(!showMap)
  }

  const confirmToggle = () => {
    setShowConfirm(!showConfirm)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirm(false)
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'DELETE'
      )
      props.onDelete(props.id)
    } catch (err) {}
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={mapToggle}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={mapToggle}>Close</Button>}
      >
        <div className="map-container">
          <h2>The map!</h2>
        </div>
      </Modal>
      <Modal
        show={showConfirm}
        onCancel={confirmToggle}
        header="Are you sure?"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={confirmDeleteHandler}>
              CONFIRM
            </Button>
            <Button onClick={confirmToggle} danger>
              Close
            </Button>
          </>
        }
      >
        <div className="map-container">
          <p>
            Do you want to proceed and delete this place? Please note that it
            can't be undone thereafter.
          </p>
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={mapToggle}>
                View on map
              </Button>
              {auth.userId === props.creatorId && (
                <Button to={`/places/${props.id}`}>Edit</Button>
              )}
              {auth.userId === props.creatorId && (
                <Button danger onClick={confirmToggle}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem
