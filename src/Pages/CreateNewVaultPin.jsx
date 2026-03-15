import { Helmet } from "react-helmet-async";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MobileSideBar, Sidebar, SidebarItem } from "../Components/UserSidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

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

const CreateNewVaultPin = () => {
  const cookies = new Cookies();
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("profile")) || {};
    } catch {
      return {};
    }
  })();
  const inputRefs = useRef([]);
  const [vaultPin, setVaultPin] = useState("");

  const handleInputChange = (index, value) => {
    // Move to the next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Update the vault pin
    const newVaultPin = Array.from({ length: 6 }, (_, i) => {
      return i === index ? value : vaultPin[i] || "";
    }).join("");
    setVaultPin(newVaultPin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = cookies.get("token") || localStorage.getItem("token");
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/createVaultPin`,
        {
          vaultPin: vaultPin,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        toast.success(response.data.message);
      })
      .catch(function (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <main className=" flex h-screen overflow-hidden pr-4 py-4 bg-black">
      <Helmet>
        <title> {Profile.firstName}'s Settings</title>
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

      {/* //maincontent */}
      <main className=" w-full bg-white rounded-3xl p-4">
        <div className=" h-full flex flex-col justify-center items-center gap-3">
          <div className="flex flex-row space-x-2">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 rounded-lg text-center outline-none border-2"
                maxLength={1}
                minLength={1}
                type="text"
                value={vaultPin[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            ))}
          </div>
          <button
            className="border w-fit px-3 py-1 rounded-lg bg-black text-white"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </main>
    </main>
  );
};

export default CreateNewVaultPin;
