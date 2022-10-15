import React from "react";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElement/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = ({ items, deletePlace }) => {
  if (!items || items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Mybe create one?</h2>
          <Button end to="/places/new">
            Share Place
          </Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          place={place}
          deletePlaceHandler={() => {
            deletePlace(place.id);
          }}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
