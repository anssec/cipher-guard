import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { HelmetProvider } from "react-helmet-async";
import EmailVerify from "./Pages/EmailVerify";
import Auth from "./middleware/auth";
import PageNotFound from "./Pages/PageNotFound";
import PreventLogin from "./middleware/preventLogin";
import EmailOtpDetect from "./middleware/EmailOtpDetect";
import Main from "./Pages/Home/Main";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import AdminDashboard from "./Admin/Dashboard";
import AdminLogin from "./Admin/Login";
import AdminAuth from "./middleware/admin/Auth";
import AdminPreventLogin from "./middleware/admin/PreventLogin";
import AdminUsers from "./Admin/Users";
import AdminAnalytics from "./Admin/Analytics";
import AdminUnlockUsers from "./Admin/UnlockUser";
import AdminSetting from "./Admin/Setting";
import Notes from "./Pages/Notes";
import Settings from "./Pages/Settings";
import Generator from "./Pages/Generator";
import Vault from "./Pages/Vault";
import CreateNewVaultPin from "./Pages/CreateNewVaultPin";
import CookiesPolicy from "./Pages/CookiesPolicy";
import TermsofUse from "./Pages/TermsofUse";
const App = () => {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/terms-of-use" element={<TermsofUse />} />

        <Route path="/login" element={<PreventLogin Component={Login} />} />
        <Route
          path="/register"
          element={<PreventLogin Component={Register} />}
        />
        <Route
          path="/register/otpverify"
          element={<EmailOtpDetect Component={EmailVerify} />}
        />

        {/* User Routes */}
        <Route path="/vault" element={<Auth Component={Vault} />} />
        <Route path="/notes" element={<Auth Component={Notes} />} />
        <Route path="/generator" element={<Auth Component={Generator} />} />
        <Route path="/settings" element={<Auth Component={Settings} />} />
        <Route
          path="/settings/create-vault-pin"
          element={<Auth Component={CreateNewVaultPin} />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminAuth Component={AdminDashboard} />}
        />
        <Route
          path="/admin/login"
          element={<AdminPreventLogin Component={AdminLogin} />}
        />
        <Route
          path="/admin/users"
          element={<AdminAuth Component={AdminUsers} />}
        />
        <Route
          path="/admin/analytics"
          element={<AdminAuth Component={AdminAnalytics} />}
        />
        <Route
          path="/admin/unlock-user"
          element={<AdminAuth Component={AdminUnlockUsers} />}
        />
        <Route
          path="/admin/setting"
          element={<AdminAuth Component={AdminSetting} />}
        />

        {/* Page Not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HelmetProvider>
  );
};

export default App;
