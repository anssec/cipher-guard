import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
import { MobileSideBar, Sidebar, SidebarItem } from "../Components/UserSidebar";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { BiCaretLeft } from "react-icons/bi";
import { BiCaretRight } from "react-icons/bi";
import { toast } from "react-hot-toast";

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
    active: true,
  },
  {
    icon: <IoSettingsOutline className="w-5 h-5" />,
    link: "/settings",
  },
];

const Generator = () => {
  const [passwdLength, setPasswdLength] = useState(6);
  const [formData, setFormData] = useState({
    capital: "",
    small: "",
    special: "",
    number: "",
    length: 6,
  });
  const [uniquePassword, setUniquePasswd] = useState("");
  const [loader, setLoader] = useState(false);
  const [usernameloader, setUsernameLoader] = useState(false);
  const [username, setUsername] = useState("");
  const handleCheckedChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? name : "",
    }));
  };

  // Function to increment the count
  const increment = () => {
    setPasswdLength(passwdLength + 1);
    setFormData((prevData) => ({
      ...prevData,
      length: passwdLength + 1,
    }));
  };

  // Function to decrement the count
  const decrement = () => {
    if (passwdLength > 6) {
      setPasswdLength(passwdLength - 1);
      setFormData((prevData) => ({
        ...prevData,
        length: passwdLength - 1,
      }));
    }
  };

  const generatepasswd = async () => {
    setLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/passwordVault/generatePasswd`,
        formData,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      setUniquePasswd(response.data.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const generateUsername = async () => {
    setUsernameLoader(true);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/passwordVault/generateUsername`,
        "",
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      setUsername(response.data.data);
      setUsernameLoader(false);
    } catch (error) {
      setUsernameLoader(false);
      toast.error(error.response.data.message || "An error occurred");
    }
  };
  //* Copy to clipboard
  const passwordCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniquePassword);
      toast.success("Password copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };
  const usernameCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(username);
      toast.success("Password copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("profile")) || {};
    } catch {
      return {};
    }
  })();
  return (
    <main className="flex h-screen overflow-hidden pr-4 py-4 bg-black">
      <Helmet>
        <title>{Profile.firstName}'s Generator</title>
        <meta name="description" content="" />
      </Helmet>
      <Sidebar>
        <Link to={"/vault"}>
          <SidebarItem
            icon={<PiVaultLight className="w-5 h-5" />}
            text={"Vault"}
          />
        </Link>
        <Link to={"/notes"}>
          <SidebarItem
            icon={<GrDocumentNotes className="w-5 h-5" />}
            text={"Notes"}
          />
        </Link>
        <Link to={"/generator"}>
          <SidebarItem
            icon={<RiAiGenerate className="w-5 h-5" />}
            text={"Generator"}
            active={true}
          />
        </Link>
        <Link to={"/settings"}>
          <SidebarItem
            icon={<IoSettingsOutline className="w-5 h-5" />}
            text={"Settings"}
          />
        </Link>
      </Sidebar>

      {/* mobile sidebar */}
      <MobileSideBar items={MobileSidebarItems} />

      {/* main content */}
      <main className="w-full bg-white rounded-3xl p-4">
        <div className="flex gap-4 flex-wrap justify-center items-center">
          {/* Password generator */}
          <div className="min-w-56 w-1/2 border border-neutral-500 rounded-md p-4">
            <p className="text-center uppercase text-xl font-medium mb-3">
              Password
            </p>
            <div className="">
              <div className="flex justify-between items-center border border-neutral-500 rounded-md py-2 px-2.5">
                <p className="w-fit truncate overflow-hidden">
                  {uniquePassword}
                </p>
                <div className=" w-fit flex gap-2 items-center">
                  <MdOutlineContentCopy
                    onClick={passwordCopyToClipboard}
                    className="w-7 h-7 cursor-pointer"
                  />
                  {loader ? (
                    <div className="spinner bg-black mx-auto"></div>
                  ) : (
                    <FaArrowsRotate
                      onClick={generatepasswd}
                      className="w-7 h-7 cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <div className="mt-1.5 space-y-1.5">
                <div className="border border-neutral-500 rounded-md py-2 px-2.5 flex justify-between focus:outline-none accent-black">
                  Length
                  <div className="flex gap-2">
                    <p className="select-none flex">{formData.length}</p>
                    <div className="flex gap-1">
                      <button
                        className="text-2xl border border-neutral-500 rounded-md"
                        onClick={decrement}
                      >
                        <BiCaretLeft />
                      </button>
                      <button
                        className="text-2xl border border-neutral-500 rounded-md"
                        onClick={increment}
                      >
                        <BiCaretRight />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border border-neutral-500 rounded-md py-2 px-2.5 flex justify-between focus:outline-none accent-black">
                  A-Z
                  <input
                    type="checkbox"
                    name="capital"
                    checked={!!formData.capital}
                    onChange={handleCheckedChange}
                  />
                </div>
                <div className="border border-neutral-500 rounded-md py-2 px-2.5 flex justify-between focus:outline-none accent-black">
                  a-z
                  <input
                    type="checkbox"
                    name="small"
                    checked={!!formData.small}
                    onChange={handleCheckedChange}
                  />
                </div>
                <div className="border border-neutral-500 rounded-md py-2 px-2.5 flex justify-between focus:outline-none accent-black">
                  0-9
                  <input
                    type="checkbox"
                    name="number"
                    checked={!!formData.number}
                    onChange={handleCheckedChange}
                  />
                </div>
                <div className="border border-neutral-500 rounded-md py-2 px-2.5 flex justify-between focus:outline-none accent-black">
                  !@#$%^&*
                  <input
                    type="checkbox"
                    name="special"
                    checked={!!formData.special}
                    onChange={handleCheckedChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Username generator */}
          <div className="min-w-56 w-1/2 border border-neutral-500 rounded-md p-4">
            <div className="text-center uppercase text-xl font-medium mb-3">
              Username
            </div>
            <div>
              <div className="flex justify-between items-center border border-neutral-500 rounded-md py-2 px-2.5">
                <p className="w-fit truncate overflow-hidden">{username}</p>
                <div className=" w-fit flex gap-2 items-center">
                  <MdOutlineContentCopy
                    onClick={usernameCopyToClipboard}
                    className="w-7 h-7 cursor-pointer"
                  />
                  {usernameloader ? (
                    <div className="spinner bg-black mx-auto"></div>
                  ) : (
                    <FaArrowsRotate
                      onClick={generateUsername}
                      className="w-7 h-7 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
};

export default Generator;
