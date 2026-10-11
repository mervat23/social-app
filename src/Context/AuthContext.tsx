import { createContext, useEffect, useState, type ReactNode } from "react";
interface AuthContextType {
  token: string | null;
  insertUserToken: (tkn: string) => void;
  logoutContext: () => void;
}

export const authContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  function insertUserToken(tkn: string) {
    setToken(tkn);
  }

  function logoutContext() {
    localStorage.removeItem("token");
    setToken(null);
  }

  useEffect(function () {
    if (localStorage.getItem("token") != null) {
      setToken(localStorage.getItem("token"));
    }
  }, []);
  return (
    <authContext.Provider value={{ insertUserToken, token, logoutContext }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
