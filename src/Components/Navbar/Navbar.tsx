import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "./../../Context/AuthContext";

const Navbar = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("Navbar must be used within AuthContextProvider");
  }

  const { token, logoutContext } = context;
  const Navigate = useNavigate();

  function logout() {
    logoutContext();
    Navigate("/login");
  }

  return (
    <>
      <div className="py-5 shadow-2xl">
        <div className="w-[95%] md:w-[85%] mx-auto">
          <ul className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
            {token ? (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/changePassword">Change Password</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">login</Link>
                </li>
                <li>
                  <Link to="/register">register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
