import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { MobileSideBar, Sidebar, SidebarItem } from "../components/UserSidebar";
const MobileSidebarItems = [
  {
    icon: <PiVaultLight className="w-5 h-5" />,
    link: "/dashboard",
    active: true,
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
  },
];
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
// import { Cookies } from "react-cookie";
import { PiVaultLight } from "react-icons/pi";
import { GrDocumentNotes } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import EditPasswdUsername from "../components/EditPasswdUsername";
import AddNewLogins from "../components/AddNewLogins";
import EnterVaultPin from "../components/EnterVaultPin";
// import useVaultPinStore from "../Zustand/Vault_Pin";
import SkeletonLoader from "../components/SkeletonLoader";
import { useCookies } from "react-cookie";
const Vault = () => {
  const Profile = JSON.parse(localStorage.getItem("profile"));
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const v_Pin = cookies["v_pin"];
  const [loader, setLoader] = useState(false);
  // const [searchInput, setSearchInput] = useState([]);
  const [editPasswdUsername, setEditPasswdUsername] = useState(false);
  const [addNewLogin, setAddNewLogin] = useState(false);
  const [checkVpin, setCheckVpin] = useState(false);
  const [getSavedPasswd, setGetSavedPasswd] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);

  const getAllPassword = async () => {
    setLoader(true);
    //   const token = cookies.get("token") || localStorage.getItem("token");
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/passwordVault/getAllPasswd`,
        "",
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      )
      .then(function (response) {
        //   console.log(response.data.data);
        setGetSavedPasswd(response.data.data);
        setLoader(false);
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
        //   console.log(error.response.data.message);
      });
  };

  //* Edit Existing Logins
  const handleEditPassUname = (id) => {
    setEditPasswdUsername((prev) => !prev);
    setCurrentEditId(id);
  };
  const handleSavePassUname = async (data) => {
    // Close the modal and perform logout
    try {
      setLoader(true);
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/passwordVault/updateSavedPasswd/${currentEditId}`,
        data,
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      // console.log(response);
      toast.success(response.data.message); // Close the modal
      getAllPassword();
      setLoader(false);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      setLoader(false);
    }
    setEditPasswdUsername(false);
  };

  const handleEditPassUnameCancel = () => {
    // Close the modal without logging out
    setEditPasswdUsername(false);
  };
  const handleEditPassUnameTrash = async () => {
    try {
      setLoader(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/passwordVault/deletePasswd/${currentEditId}`,
        " ",
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      // console.log(response);
      toast.success(response.data.message); // Close the modal
      getAllPassword();
      setLoader(false);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      setLoader(false);
    }
    setEditPasswdUsername(false);
  };

  // console.log(formData);
  //* Add new LOgins
  const handleNewLogin = () => {
    setAddNewLogin((prev) => !prev);
  };
  const handleSaveNewLogin = async () => {
    //* Close the modal
    const formData = JSON.parse(localStorage.getItem("New_LoginDetails"));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/passwordVault/createPasswd`,
        {
          username: formData.username,
          password: formData.password,
          website: formData.website,
        },
        {
          withCredentials: true,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${v_Pin}`,
          },
        }
      );
      // console.log(response);
      localStorage.removeItem("New_LoginDetails");
      toast.success(response.data.message);
      getAllPassword();
      setAddNewLogin(false);
      setLoader(false);
    } catch (error) {
      setAddNewLogin(false);
      toast.error(error.response.data.message || "An error occurred");
      localStorage.removeItem("New_LoginDetails");
      setLoader(false);
    }
  };
  const handleNewLoginCancel = () => {
    setAddNewLogin(false);
  };

  //* refresh all password
  useEffect(() => {
    // console.log("Running useEffect...");
    const hasReloaded = localStorage.getItem("hasReloaded");
    // console.log("hasReloaded:", hasReloaded);
    // console.log("v_Pin:", v_Pin);

    if (!v_Pin) {
      if (!hasReloaded) {
        console.log("Reloading...");
        setCheckVpin(false);
        localStorage.setItem("hasReloaded", true);
        window.location.reload();
      }
    } else if (v_Pin) {
      // console.log("Valid v_Pin detected.");
      setCheckVpin(true);
      localStorage.setItem("hasReloaded", false);
    }

    getAllPassword();
  }, []);

  // *Search Password
  const handelSearch = (value) => {
    if (!value) {
      getAllPassword();
    } else {
      const searchResult = getSavedPasswd.filter((passwd) =>
        new RegExp(value, "i").test(passwd.name)
      );
      setGetSavedPasswd(searchResult);
    }
  };
  return (
    <main className=" flex h-screen overflow-hidden pr-4 py-4 bg-black">
      <Helmet>
        <title> {Profile.firstName}'s Dashboard</title>
        <meta name="description" content="Cipher Guard Dashboard." />
      </Helmet>
      <Sidebar>
        <Link to={"/vault"}>
          <SidebarItem
            icon={<PiVaultLight className=" w-5 h-5" />}
            text={"Vault"}
            active={true}
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
          />
        </Link>
      </Sidebar>

      {/* mobile sidebar  */}
      <MobileSideBar items={MobileSidebarItems} />

      {/* //maincontent */}
      <main className=" w-full bg-white rounded-3xl p-4 ">
        {/* <EnterVaultPin />         */}
        {checkVpin ? (
          <div className="w-full flex flex-col justify-center lg:items-center gap-y-3 transition-all">
            {/* filter section */}
            <div className="w-full h-fit flex flex-col gap-2 lg:max-w-xl border border-neutral-500 rounded-md p-4">
              <p className=" uppercase font-semibold">Filters</p>
              <div className=" flex items-center gap-2 shadow-md p-2.5 rounded-lg">
                <div className=" w-fit">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  className=" focus:outline-none w-full lg:w-fit bg-transparent text-base"
                  placeholder="Search logins"
                  onChange={(e) => handelSearch(e.target.value)}
                />
              </div>
            </div>
            {/* Password section */}
            <div className="w-full h-[70vh] lg:max-w-xl flex flex-col p-4 border border-neutral-500 rounded-md">
              <div className=" flex justify-between">
                <p className="uppercase font-semibold ">My vault</p>
                <button className="font-semibold text-2xl relative rounded-md transition-transform group hover:text-neutral-600">
                  <IoMdAdd onClick={handleNewLogin} />
                  <div className="absolute w-20 hidden -bottom-1.5 rounded-md px-2 py-2 bg-black text-white text-sm opacity-0 transform -translate-x-full transition-transform group-hover:opacity-100 group-hover:block group-hover:translate-y-0 shadow-md">
                    Add new
                  </div>
                </button>
              </div>
              {/* password & username  */}
              {loader ? (
                <SkeletonLoader />
              ) : (
                <div className="mt-4 overflow-y-auto no-scrollbar">
                  {getSavedPasswd.map((value, index) => (
                    <>
                      <div
                        key={index}
                        className=" w-full flex items-center justify-between border-t border-neutral-400 py-2.5 px-4 hover:bg-neutral-100 transition-all cursor-pointer overflow-y-auto no-scrollbar"
                      >
                        <img className="w-5 h-5" src={value.websiteFavicon} />
                        <div className=" w-full mx-3">
                          <p className=" text-blue-800 font-semibold break-all text-base">
                            {value.name}
                          </p>
                          <p className=" text-neutral-500 w-24 sm:w-56 text-ellipsis overflow-hidden text-sm">
                            {value.username}
                          </p>
                        </div>
                        <div className=" w-6 h-6 flex items-center justify-center">
                          <FaRegEdit
                            onClick={() => handleEditPassUname(value._id)}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      </div>
                      <EditPasswdUsername
                        isOpen={editPasswdUsername}
                        onClose={handleEditPassUnameCancel}
                        onConfirm={handleSavePassUname}
                        onTrash={handleEditPassUnameTrash}
                        onUserData={
                          getSavedPasswd.find(
                            (item) => item._id === currentEditId
                          ) || {}
                        }
                      />
                    </>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <EnterVaultPin />
        )}
      </main>
      <AddNewLogins
        isOpen={addNewLogin}
        onConfirm={handleSaveNewLogin}
        onClose={handleNewLoginCancel}
      />
    </main>
  );
};

export default Vault;
