import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";

import Modal from "../../shared/components/UIElement/Modal";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceItem.css";

const PlaceItem = ({ place, deletePlaceHandler }) => {
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const auth = useContext(AuthContext);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const openDeletModalHandler = () => setshowDeleteModal(true);
  const closeDeletModalHandler = () => setshowDeleteModal(false);

  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={place.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          {/* <Map center={place.location} zoom={16}/> */}
          <h2>Lat:{place.location.lat}</h2>
          <h2>Lat:{place.location.lng}</h2>
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={closeDeletModalHandler}
        header="Are you sure ?"
        footerClass="place-item__modal-actions"
        footer={
          <div>
            <Button onClick={deletePlaceHandler}>Yes</Button>
            <Button onClick={closeDeletModalHandler}>No</Button>
          </div>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${place.image}`}
              alt={place.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{place.title}</h2>
            <h3>{place.address}</h3>
            <p>{place.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.user.id === place.creator && (
              <Button to={`/places/${place.id}`}>EDIT</Button>
            )}
            {auth.user.id === place.creator && (
              <Button danger onClick={openDeletModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
