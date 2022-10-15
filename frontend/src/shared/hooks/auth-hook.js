import { useCallback, useEffect, useState } from "react";

let logoutTimer;
export const useAuth = () => {
  const [user, setUser] = useState({ token: null });
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((user, expirationDate) => {
    setUser(user);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user: user,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUser({ token: null });
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (user.token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [user.token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      !!storedData &&
      storedData.user.id &&
      storedData.user.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.user, new Date(storedData.expiration));
    }
  }, [login]);

  return { user, login, logout };
};
