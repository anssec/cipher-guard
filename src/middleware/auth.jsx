import { Cookies } from "react-cookie";
import { isExpired, decodeToken } from "react-jwt";
import { Navigate } from "react-router-dom";

const Auth = ({ Component }) => {
  const cookies = new Cookies();
  const token = cookies.get("token") || localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (!token || !profile) {
    // console.log("no token");
    cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    return <Navigate to={"/login"} />;
  } else {
    const isMyTokenExpired = isExpired(token);
    if (isMyTokenExpired === true) {
      cookies.remove("token");
      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      return <Navigate to={"/login"} />;
    }
  }
  return (
    <div>
      <Component />
    </div>
  );
};

export default Auth;
