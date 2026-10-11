import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (localStorage.getItem("token") == null) {
    return <Navigate to={"/login"} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
