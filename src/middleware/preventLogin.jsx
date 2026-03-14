import { Cookies } from "react-cookie";
import { isExpired } from "react-jwt";
import { Navigate } from "react-router-dom";

const PreventLogin = ({ Component }) => {
  const cookies = new Cookies();
  // Cookie is the single source of truth for auth state
  const token = cookies.get("token");

  if (token) {
    const isMyTokenExpired = isExpired(token);
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
    }
  }
  return (
    <div>
      <Component />
    </div>
  );
};

export default PreventLogin;
