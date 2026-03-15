import { ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import { PiSignOut } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
const SidebarContext = createContext();
import { Cookies } from "react-cookie";
import { toast } from "react-hot-toast";

// Modal component
const Modal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative bg-white p-8 w-96 rounded-md shadow-lg">
          <div className="flex flex-col items-center">
            <p className="mb-4 text-2xl font-semibold text-black">Logout</p>
            <p className="mb-4 text-gray-700">
              Are you sure you want to log out?
            </p>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-gray-800 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="ml-2 px-4 py-2 text-white bg-black rounded-md"
              onClick={onConfirm}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarExpanded"));
  });
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const cookies = new Cookies();
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("profile")) || {};
    } catch {
      return {};
    }
  })();
  const navigate = useNavigate();
  const logoutHandler = () => {
    setLogoutModalOpen(true);
  };
  const handleLogoutConfirm = () => {
    // Close the modal and perform logout
    setLogoutModalOpen(false);
    cookies.remove("token");
    cookies.remove("v_pin");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    toast.success("Logout");
    navigate("/");
  };

  const handleLogoutCancel = () => {
    // Close the modal without logging out
    setLogoutModalOpen(false);
  };
  const sideBarHandler = (e) => {
    setExpanded((curr) => !curr);
  };
  // Store the expanded state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <aside className="h-screen">
      <nav className="h-full hidden md:flex flex-col shadow-sm">
        <div
          className={`overflow-hidden transition-all ${
            expanded ? "pl-14 mt-12 mb-1" : "ml-1"
          }`}
        >
          <img
            className={`${
              expanded ? "w-16 rounded-2xl" : "w-9 rounded-lg mx-3 mt-5"
            }`}
            src={Profile.profileImg}
            alt=""
          />
          <p
            className={` text-2xl text-white font-semibold ${
              expanded ? "mt-2" : "hidden"
            }`}
          >
            {Profile.firstName}
          </p>
          <p
            className={` text-xs text-neutral-400 ${
              expanded ? "mt-2" : "hidden"
            }`}
          >
            {Profile.email}
          </p>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul
            className={`flex-1 overflow-hidden transition-all ${
              expanded ? "ml-14 mt-14" : "ml-2 mt-10"
            }`}
          >
            {children}
            <div onClick={logoutHandler}>
              <SidebarItem
                icon={<PiSignOut className=" w-5 h-5" />}
                text={"Logout"}
              />
            </div>
          </ul>
        </SidebarContext.Provider>
        <div className="p-4 pb-8 flex justify-end items-center">
          <button
            onClick={sideBarHandler}
            className="p-1.5 rounded-lg bg-neutral-600 hover:bg-neutral-400"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
      </nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};

export function SidebarItem({ icon, text, active }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`
        relative flex items-center py-4 pl-4 my-2
        font-medium rounded-l-full cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-white text-black"
            : "hover:bg-neutral-600 hover:text-white text-neutral-300"
        }
    `}
    >
      {icon}
      <span
        className={` overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
    </li>
  );
}

export const MobileSideBar = ({ items }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("profile")) || {};
    } catch {
      return {};
    }
  })();
  const logoutHandler = () => {
    setLogoutModalOpen(true);
  };
  const handleLogoutConfirm = () => {
    // Close the modal and perform logout
    setLogoutModalOpen(false);
    cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    toast.success("Loggout");
    navigate("/");
  };

  const handleLogoutCancel = () => {
    // Close the modal without logging out
    setLogoutModalOpen(false);
  };
  return (
    <aside className="h-screen  ">
      <nav className="h-full flex md:hidden flex-col shadow-sm">
        <img
          className="w-9 rounded-lg mx-2.5 mt-5"
          src={Profile.profileImg}
          alt=""
        />

        <ul className="flex-1 mt-8">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`
                relative flex items-center py-4 px-5 my-2
                font-medium rounded-l-full cursor-pointer
                transition-colors group
                ${
                  item.active
                    ? " bg-white text-black"
                    : "hover:bg-neutral-600 hover:text-white text-neutral-300"
                }
              `}
            >
              {item.icon}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className={`
              relative flex items-center py-4 px-5 my-2
              font-medium rounded-l-full cursor-pointer
              transition-colors group hover:bg-neutral-600 hover:text-white text-neutral-300`}
          >
            <PiSignOut className="w-5 h-5" />
          </button>
        </ul>
      </nav>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </aside>
  );
};
