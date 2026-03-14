import { Cookies } from "react-cookie";
import { isExpired, decodeToken } from "react-jwt";
import { Navigate } from "react-router-dom";
const PreventLogin = ({ Component }) => {
  const cookies = new Cookies();
  const token = cookies.get("token") || localStorage.getItem("token");
  if (token) {
    const myDecodedToken = decodeToken(token);
    const isMyTokenExpired = isExpired(token);
    console.log(myDecodedToken, isMyTokenExpired);
    if (!isMyTokenExpired) {
      return <Navigate to={"/vault"} />;
    }
  }
  return (
    <div>
      <Component />
    </div>
  );
};

export default PreventLogin;
