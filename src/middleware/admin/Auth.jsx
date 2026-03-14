import { Cookies } from "react-cookie";
import { isExpired } from "react-jwt";
import { Navigate } from "react-router-dom";
const Auth = ({ Component = () => null }) => {
  const cookies = new Cookies();
  const token =
    cookies.get("admin_token") || localStorage.getItem("admin_token");
  const adminProfile = JSON.parse(localStorage.getItem("admin_profile"));
  if (!token || !adminProfile) {
    // console.log("no token");
    cookies.remove("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    return <Navigate to={"/admin/login"} />;
  } else {
    const isMyTokenExpired = isExpired(token);
    if (isMyTokenExpired === true) {
      cookies.remove("admin_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_profile");
      return <Navigate to={"/admin/login"} />;
    }
  }
  return (
    <div>
      <Component />
    </div>
  );
};

export default Auth;
