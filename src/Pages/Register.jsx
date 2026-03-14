import spaceArt from "../assets/registerArt.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdPassword } from "react-icons/md";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import axios from "axios";
const Register = () => {
  const [cookies, setCookie] = useCookies(["data"]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [view, setView] = useState(true);
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
    // Add your form submission logic here
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register/sendOtp`,
        formData,
        {
          withCredentials: true,
          credentials: "include",
        }
      )
      .then(function (response) {
        localStorage.setItem("data", response.data.data);
        setCookie("data", response.data.data, {
          maxAge: 36600,
        });
        toast.success(response.data.message);
        navigate("/register/otpverify");
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
        <title>Register</title>
        <meta name="description" content="Cipher Guard Register page." />
      </Helmet>
      <div className=" mx-auto w-9/12 h-4/5 shadow-lg rounded-xl">
        <div className="flex h-full">
          {/* Left side */}
          <div className="hidden rounded-tl-2xl rounded-bl-2xl w-3/5 bg-[#2B2B2B] shadow-lg lg:flex flex-col justify-center items-center">
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
            <div className=" text-3xl">Get Started</div>
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto mt-5 flex flex-col gap-2 p-6 text-gray-600 "
              >
                <label className="flex items-center">
                  <FaUser className="mr-2" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                  />
                </label>

                <label className="flex items-center">
                  <FaUser className="mr-2" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                    required
                  />
                </label>

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

                <label className="flex items-center">
                  <MdPassword className="mr-2" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                    required
                  />
                </label>

                <label className="flex items-center  relative">
                  <MdPassword className="mr-2" />
                  <input
                    type={view ? "password" : "text"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="ml-2 p-2 border border-gray-400 rounded-md w-4/5 outline-none"
                    required
                  />
                  <div
                    onClick={handlePasswdView}
                    className="absolute top-1/2 transform -translate-y-1/2 right-[8%] sm:right-[15%]   cursor-pointer"
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
                  >
                    Send otp
                  </button>
                )}
              </form>
            </div>
            <div>Aready have account?</div>
            <Link
              className=" mt-3 p-2 w-7/12 rounded-full text-center text-[#BFAFF2] border border-[#BFAFF2] cursor-pointer"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
