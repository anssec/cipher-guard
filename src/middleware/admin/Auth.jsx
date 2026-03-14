import { Cookies } from "react-cookie";
import { isExpired } from "react-jwt";
import { Navigate } from "react-router-dom";

const Auth = ({ Component = () => null }) => {
  const cookies = new Cookies();
  // Cookie is single source of truth — no localStorage fallback for tokens
  const token = cookies.get("admin_token");
  const adminProfile = JSON.parse(localStorage.getItem("admin_profile"));

  if (!token || !adminProfile) {
    cookies.remove("admin_token");
    localStorage.removeItem("admin_profile");
    return <Navigate to={"/admin/login"} />;
  }

  const isMyTokenExpired = isExpired(token);
  if (isMyTokenExpired) {
    cookies.remove("admin_token");
    localStorage.removeItem("admin_profile");
    return <Navigate to={"/admin/login"} />;
  }

  return (
    <div>
      <Component />
    </div>
  );
};

export default Auth;
