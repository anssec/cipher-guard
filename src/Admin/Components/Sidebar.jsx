import { ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";
import Logo from "../../assets/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
const SidebarContext = createContext();
import { Cookies } from "react-cookie";
import { toast } from "react-hot-toast";

export const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const cookies = new Cookies();
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin_profile")) || {};
    } catch {
      return {};
    }
  })();
  const navigate = useNavigate();
  const logoutHandler = () => {
    cookies.remove("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    toast.success("Logout");
    navigate("/");
  };
  return (
    <aside className="h-screen ">
      <nav className="h-full hidden sm:flex flex-col border-neutral-700 border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={Logo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Profile Image"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-neutral-600 hover:bg-neutral-400"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
            <div onClick={logoutHandler}>
              <SidebarItem
                icon={<FaSignOutAlt className=" w-5 h-5" />}
                text={"Logout"}
              />
            </div>
          </ul>
        </SidebarContext.Provider>
        <div className="border-neutral-700 border-t flex items-center justify-center p-3">
          <img className="w-8 h-8 rounded-md" src={Profile.profileImg} alt="" />
          <div
            className={`
              flex justify-between  items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">
                {Profile.firstName} {Profile.lastName}
              </h4>
              <span className="text-xs text-neutral-500">{Profile.email}</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export function SidebarItem({ icon, text, active }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-5
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-neutral-300 text-black"
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

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-neutral-300 text-black text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

export const MobileSideBar = ({ items }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const Profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin_profile")) || {};
    } catch {
      return {};
    }
  })();
  const logoutHandler = () => {
    cookies.remove("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_profile");
    toast.success("Loggout");
    navigate("/");
  };
  return (
    <aside className="h-screen  ">
      <nav className="h-full flex sm:hidden fixed left-0 top-0 flex-col border-neutral-700 border-r shadow-sm">
        <ul className="flex-1 px-3 my-5">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`
                relative flex items-center p-3 my-5
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${
                  item.active
                    ? "bg-neutral-300 text-black"
                    : "hover:bg-neutral-600 hover:text-white text-neutral-300"
                }
              `}
            >
              {item.icon}

              <div
                className={`
                  absolute left-full rounded-md px-2 py-1 ml-6
                  bg-neutral-300 text-black text-sm
                  invisible opacity-20 -translate-x-3 transition-all
                  group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
              >
                {item.text}
              </div>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={logoutHandler}
            className={`
              relative flex items-center p-3 my-5
              font-medium rounded-md cursor-pointer
              transition-colors group hover:bg-neutral-600 hover:text-white text-neutral-300`}
          >
            <FaSignOutAlt className="w-5 h-5" />
            <div
              className={`
                absolute left-full rounded-md px-2 py-1 ml-6
                bg-neutral-300 text-black text-sm
                invisible opacity-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
            >
              Logout
            </div>
          </button>
        </ul>
        <div className="border-neutral-700 border-t flex items-center justify-center p-3">
          <img
            className="w-8 h-8 rounded-md"
            src={Profile.profileImg}
            alt="Profile Image"
          />
        </div>
      </nav>
    </aside>
  );
};
