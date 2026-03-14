import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import { MobileSideBar, Sidebar, SidebarItem } from "../components/UserSidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { FaArrowsRotate } from "react-icons/fa6";
const MobileSidebarItems = [
  {
    icon: <PiVaultLight className="w-5 h-5" />,
    link: "/dashboard",
  },
  {
    icon: <GrDocumentNotes className="w-5 h-5" />,
    link: "/notes",
  },
  {
    icon: <RiAiGenerate className="w-5 h-5" />,
    link: "/generator",
  },
  {
    icon: <IoSettingsOutline className="w-5 h-5" />,
    link: "/settings",
    active: true,
  },
];

const Settings = () => {
  const Profile = JSON.parse(localStorage.getItem("profile"));
  const cookies = new Cookies();
  const [isUserProfile, setIsUserProfile] = useState({});
  const [loader, setLoader] = useState(false);
  const [genPassloader, setGenPassLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    confirmPassword: "",
    password: "",
  });
  const [dataSaveloader, setDataSaveloader] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchProfile = async () => {
    setLoader(true);
    const token = cookies.get("token") || localStorage.getItem("token");
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, "", {
        withCredentials: true,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setIsUserProfile(response.data.data);
        setLoader(false);
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
        setLoader(false);
      });
  };

  const generatepasswd = async () => {
    setGenPassLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/passwordVault/generatePasswd`,
        {
          capital: "capital",
          length: 14,
          small: "small",
          special: "special",
          number: "number",
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      setFormData((prevData) => ({
        ...prevData,
        password: response.data.data,
      }));
      setGenPassLoader(false);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      setGenPassLoader(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    setDataSaveloader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/features/emergencyAccess`,
        formData,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      toast.success(response.data.message);
      window.location.reload();
      setIsModalOpen(false);
      setDataSaveloader(false);
      setFormData({
        email: "",
        confirmPassword: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      setIsModalOpen(false);
      setDataSaveloader(false);
      setFormData({
        email: "",
        confirmPassword: "",
        password: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      confirmPassword: "",
      password: "",
    });
    setIsModalOpen(false);
  };
  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black">
      <Helmet>
        <title>{Profile?.firstName}'s Settings</title>
        <meta name="description" content="" />
      </Helmet>
      <Sidebar>
        <Link to={"/vault"}>
          <SidebarItem
            icon={<PiVaultLight className=" w-5 h-5" />}
            text={"Vault"}
          />
        </Link>
        <Link to={"/notes"}>
          <SidebarItem
            icon={<GrDocumentNotes className=" w-5 h-5" />}
            text={"Notes"}
          />
        </Link>
        <Link to={"/generator"}>
          <SidebarItem
            icon={<RiAiGenerate className=" w-5 h-5" />}
            text={"Generator"}
          />
        </Link>
        <Link to={"/settings"}>
          <SidebarItem
            icon={<IoSettingsOutline className=" w-5 h-5" />}
            text={"Settings"}
            active={true}
          />
        </Link>
      </Sidebar>

      {/* mobile sidebar  */}
      <MobileSideBar items={MobileSidebarItems} />

      {/* main content */}
      <main className="w-full bg-white rounded-3xl p-4">
        <div className=" flex flex-col gap-4">
          <div className=" min-w-52 sm:w-[28rem] border border-neutral-500 rounded-md p-4 space-y-3">
            <p className=" uppercase text-center font-semibold">Profile</p>
            {loader ? (
              <div className="spinner bg-black mx-auto"></div>
            ) : (
              <>
                <div>
                  <p>
                    Name: {isUserProfile?.firstName} {isUserProfile?.lastName}
                  </p>
                </div>
                <div>
                  <p className="break-all"> Email: {isUserProfile?.email}</p>
                </div>
                <div>
                  <p>
                    Email Verified:{" "}
                    <span
                      className={`${
                        isUserProfile?.isEmailVerify
                          ? " text-green-600"
                          : " text-red-600"
                      }`}
                    >
                      {isUserProfile?.isEmailVerify ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
                <div>
                  <p>
                    Wrong Password Attempt:{" "}
                    <span className=" text-red-600">
                      {isUserProfile?.wrongPasswdAttempt?.attempts ??
                        "Data not available"}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Emergency Access */}
          <div className=" min-w-52 sm:w-[28rem] border border-neutral-500 rounded-md p-4 space-y-3 flex justify-center items-center flex-col">
            <p className=" uppercase text-center font-semibold">
              Emergency Access
            </p>
            {loader ? (
              <div className="spinner bg-black mx-auto"></div>
            ) : (
              <>
                <p className=" w-full text-left">
                  Emergency Mail:{" "}
                  {isUserProfile?.emergencyMail ? (
                    isUserProfile.emergencyMail
                  ) : (
                    <span
                      className="border w-fit px-3 py-1 rounded-lg bg-black text-white cursor-pointer"
                      onClick={handleModalOpen}
                    >
                      Add New
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Edit Emergency access */}
      <div className={`fixed inset-0 z-50 ${isModalOpen ? "" : "hidden"}`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="absolute inset-0 bg-black opacity-60"></div>

          <div className="relative bg-white p-8 w-96 rounded-md shadow-lg">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-semibold uppercase text-black">
                  Edit Emergency
                </p>
              </div>
              <form className="flex flex-col my-4 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="email">Email</label>
                  <input
                    className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password">Password</label>
                  <div className="flex w-full">
                    <input
                      className="bg-neutral-50 w-[90%] focus:outline-none border border-neutral-400 rounded-l-md p-2"
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loader}
                    />
                    <div
                      className="bg-neutral-50 w-12 h-12 cursor-pointer rounded-r-md border flex items-center justify-center border-neutral-400"
                      onClick={generatepasswd}
                    >
                      {genPassloader ? (
                        <div className="spinner bg-black mx-auto"></div>
                      ) : (
                        <FaArrowsRotate className="w-7 h-7" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="website">Confirm Password</label>
                  <input
                    className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2"
                    type="text"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <button
                    className="px-4 py-2 text-white hover:text-neutral-100 bg-black rounded-md"
                    onClick={handleSaveData}
                    type="submit"
                  >
                    Save
                  </button>
                  <button
                    className="ml-2 px-4 py-2 text-black border hover:bg-neutral-100 border-neutral-500 rounded-md"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
