import { Cookies } from "react-cookie";
import { isExpired, decodeToken } from "react-jwt";
import { Navigate } from "react-router-dom";

const Auth = ({ Component }) => {
  const cookies = new Cookies();
  // Use cookie as single source of truth — never localStorage for tokens
  const token = cookies.get("token");
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!token || !profile) {
    cookies.remove("token");
    localStorage.removeItem("profile");
    return <Navigate to={"/login"} />;
  }

  const isMyTokenExpired = isExpired(token);
  if (isMyTokenExpired) {
    cookies.remove("token");
    localStorage.removeItem("profile");
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <Component />
    </div>
  );
};

export default Auth;
