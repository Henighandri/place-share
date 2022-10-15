import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/places/" + placeId
        );

        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: loadedPlace.title,
              isValid: true,
            },
            description: {
              value: loadedPlace.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const updatePlace = async () => {
    try {
      await sendRequest(
        "http://localhost:5000/api/places/" + placeId,
        "PATCH",
        JSON.stringify({
          place: {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
          },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.user.token,
        }
      );

      navigate(`/${auth.user.id}/places`);
    } catch (error) {}
  };

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    updatePlace();
  };
  //console.log(isLoading);
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  } else if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place !</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />;
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialIsValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid Description (min . 5characters)"
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialIsValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
