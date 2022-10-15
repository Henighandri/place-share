import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { userId } = useParams();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/user/" + userId
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId]);

  const deletePlaceHandler = async (placeId) => {
    try {
      await sendRequest(
        "http://localhost:5000/api/places/" + placeId,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.user.token }
      );

      const newList = loadedPlaces.filter((place) => place.id !== placeId);
      setLoadedPlaces(newList);
    } catch (error) {}
  };

  if (error) {
    return <ErrorModal error={error} onClear={clearError} />;
  }
  return !isLoading && loadedPlaces ? (
    <PlaceList items={loadedPlaces} deletePlace={deletePlaceHandler} />
  ) : (
    <LoadingSpinner asOverlay />
  );
};

export default UserPlaces;
