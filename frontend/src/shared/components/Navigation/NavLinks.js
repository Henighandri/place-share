import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

import Avatar from "../UIElement/Avatar";
import useWindowDimensions from "../../hooks/useWindowDiemension";
const NavLinks = () => {
  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && width < 768 && (
        <div className="user-avatar">
          <Avatar
            style={{
              width: "50px",
              height: "50px",
              marginRight: "10px",
              display: "flex",
              flexDirection: "row",
            }}
            image={`http://localhost:5000/${auth.user.image}`}
            alt={auth.user.name}
          />
          <h2>{auth.user.name}</h2>
        </div>
      )}
      <li>
        <NavLink end to="/">
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.user.id}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={() => auth.logout()}>LOGOUT</button>
        </li>
      )}
      <li>
        {auth.isLoggedIn && width > 768 && (
          <div className="user-avatar">
            <Avatar
              style={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
              }}
              image={`http://localhost:5000/${auth.user.image}`}
              alt={auth.user.name}
            />
            <h2>{auth.user.name}</h2>
          </div>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
