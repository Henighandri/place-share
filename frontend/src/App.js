import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NewPlace from "./places/pages/NewPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import Users from "./user/pages/Users";
import { AuthContext } from "./shared/context/auth-context";
import React from "react";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { user, login, logout } = useAuth();

  let routes;
  if (!!user.token) {
    routes = (
      <Route path="/">
        <Route index element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    );
  } else {
    routes = (
      <Route path="/">
        <Route index element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </Route>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user.token,
        login: login,
        logout: logout,
        user: user,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Routes>{routes}</Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
