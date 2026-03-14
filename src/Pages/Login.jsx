import spaceArt from "../assets/registerArt.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { MdPassword } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useCookies } from "react-cookie";

const Login = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [view, setView] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then(function (response) {
        localStorage.setItem("token", response.data.data);
        const profile = JSON.stringify(response.data.profile);
        localStorage.setItem("profile", profile);
        setCookie("token", response.data.data, {
          maxAge: 36600,
        });
        toast.success(response.data.message);
        navigate("/vault");
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
    setLoading(false);
  };

  const handlePasswdView = (e) => {
    setView((prev) => !prev);
  };
  return (
    <div className=" h-screen flex items-center">
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Cipher Guard Login page." />
      </Helmet>
      <div className=" mx-auto w-9/12 h-4/5 shadow-md rounded-xl">
        <div className="flex h-full">
          {/* Left side */}
          <div className="hidden rounded-tl-2xl rounded-bl-2xl w-3/5 shadow-lg bg-[#2B2B2B] lg:flex flex-col justify-center items-center">
            <img src={spaceArt} className=" w-fit h-fit" />
            <p className=" font-semibold text-2xl text-white">
              Welcome aboard my friend
            </p>
            <p className=" text-white opacity-80">
              just a couple of clicks and we start
            </p>
          </div>
          {/* Right Side */}
          <div className="w-full  mx-auto  max-w-md lg:w-2/5 flex flex-col justify-center items-center">
            <div className="text-3xl">Welcome Back</div>
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto mt-5 flex flex-col gap-2 p-6 text-gray-600 "
              >
                <label className="flex items-center">
                  <CiMail className="mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                    required
                  />
                </label>
                <label className="flex items-center  relative">
                  <MdPassword className="mr-2" />
                  <input
                    type={view ? "password" : "text"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                    required
                  />
                  <div
                    onClick={handlePasswdView}
                    className="absolute top-1/2 transform -translate-y-1/2 right-[8%] sm:right-[15%]  cursor-pointer"
                  >
                    {view ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </label>
                {loading ? (
                  <div className="spinner mx-auto"></div>
                ) : (
                  <button
                    className="p-2 w-8/12 rounded-full text-white bg-[#BFAFF2] mx-auto"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading} // Disable the button while loading
                  >
                    Login
                  </button>
                )}
              </form>
            </div>
            <div>Have no account yet?</div>
            <Link
              className={` mt-3 p-2 w-7/12 rounded-full text-center text-[#BFAFF2] border border-[#BFAFF2]  ${
                loading ? " cursor-not-allowed" : " cursor-pointer"
              }`}
              to="/register"
            >
              Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
