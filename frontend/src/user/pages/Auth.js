import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElement/Card";
import "./Auth.css";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [authState, changeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authHandler = async (event) => {
    event.preventDefault();
    console.log(authState.inputs.image);
    if (isLoginMode) {
      try {
        const res = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: authState.inputs.email.value,
            password: authState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(res.user);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", authState.inputs.email.value);
        formData.append("name", authState.inputs.name.value);
        formData.append("password", authState.inputs.password.value);
        formData.append("image", authState.inputs.image.value);
        const res = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        auth.login(res.user);
      } catch (error) {}
    }
  };
  const swithModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...authState.inputs,
          name: undefined,
          image: undefined,
        },
        authState.inputs.email.isValid && authState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...authState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  if (error) {
    return <ErrorModal error={error} onClear={clearError} />;
  }

  return !isLoading ? (
    <Card className="authentication">
      <h2>{isLoginMode ? "Login required " : "Sign up"}</h2>
      <form onSubmit={authHandler}>
        <hr />

        {!isLoginMode && (
          <Input
            id="name"
            element="input"
            label="Name"
            type="text"
            placeholder="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={changeHandler}
            errorText="Please enter your name"
          />
        )}
        {!isLoginMode && (
          <ImageUpload
            center
            id="image"
            onInput={changeHandler}
            errorText="Please Pick an image."
          />
        )}
        <Input
          id="email"
          element="input"
          label="Email"
          type="email"
          placeholder="Email"
          validators={[VALIDATOR_EMAIL()]}
          onInput={changeHandler}
          errorText="Please enter a valid email"
        />
        <Input
          id="password"
          element="input"
          label="Password"
          type="password"
          placeholder="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          onInput={changeHandler}
          errorText="password is short"
        />
        <Button type="submit" disabled={!authState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={swithModeHandler}>
        SWITH TO {!isLoginMode ? "LOGIN" : "SIGNUP"}
      </Button>
    </Card>
  ) : (
    <LoadingSpinner asOverlay />
  );
};

export default Auth;
