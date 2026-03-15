import React, { useEffect, useState } from "react";
import { MobileSideBar, Sidebar, SidebarItem } from "./Components/Sidebar";
import { HiLockOpen } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { MdAnalytics } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import axios from "axios";
import { Cookies } from "react-cookie";
const MobileSidebarItems = [
  {
    icon: <MdDashboard className="w-5 h-5" />,
    text: "Dashboard",
    link: "/admin/dashboard",
    active: true,
  },
  {
    icon: <HiUsers className="w-5 h-5" />,
    text: "Users",
    link: "/admin/users",
  },
  {
    icon: <MdAnalytics className="w-5 h-5" />,
    text: "Analytics",
    link: "/admin/analytics",
  },
  {
    icon: <HiLockOpen className="w-5 h-5" />,
    text: "Unlock User",
    link: "/admin/unlock-user",
  },
  {
    icon: <IoSettingsSharp className="w-5 h-5" />,
    text: "Settings",
    link: "/admin/setting",
  },
];

const Dashboard = () => {
  const cookies = new Cookies();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const getGreeting = () => {
    const currentTime = new Date().getHours();

    if (currentTime < 12) {
      return "Good morning";
    } else if (currentTime < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  const token =
    cookies.get("admin_token") || localStorage.getItem("admin_token");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/statistics`, "", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(function (response) {
          setData(response.data.data);
        })
        .catch(function (error) {
          // Silently handle error
        });
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className=" flex h-screen overflow-hidden bg-[#2B2B2B]">
      <Helmet>
        <title>Admin - Dashboard</title>
      </Helmet>
      <Sidebar>
        <Link to={"/admin/dashboard"}>
          <SidebarItem
            icon={<MdDashboard className=" w-5 h-5" />}
            text={"Dashboard"}
            active={true}
          />
        </Link>
        <Link to={"/admin/users"}>
          <SidebarItem icon={<HiUsers className=" w-5 h-5" />} text={"Users"} />
        </Link>
        <Link to={"/admin/analytics"}>
          <SidebarItem
            icon={<MdAnalytics className=" w-5 h-5" />}
            text={"Analytics"}
          />
        </Link>
        <Link to={"/admin/unlock-user"}>
          <SidebarItem
            icon={<HiLockOpen className=" w-5 h-5" />}
            text={"Unlock user"}
          />
        </Link>
        <Link to={"/admin/setting"}>
          <SidebarItem
            icon={<IoSettingsSharp className=" w-5 h-5" />}
            text={"Settings"}
          />
        </Link>
      </Sidebar>

      {/* mobile sidebar  */}
      <MobileSideBar items={MobileSidebarItems} />

      {/* //maincontent */}
      <main className=" ml-14 sm:ml-0 p-4 w-full overflow-y-auto no-scrollbar ">
        {/* WelcomeBanner */}
        <div className="bg-indigo-200  dark:bg-indigo-500 p-4 sm:p-6 rounded-sm overflow-hidden h-fit mb-8">
          {/* Content */}
          <div className="relative">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-1">
              {getGreeting()}, Admin. 👋
            </h1>
            <p className="dark:text-indigo-200">
              Here is what’s happening with your CIpherGuard Services.
            </p>
          </div>
        </div>

        <div className="flex mb-8 flex-wrap gap-4">
          <div className=" w-56 text-center border mx-auto px-8 py-3 rounded-lg shadow bg-red-400 border-red-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Total Users
            </h5>

            <p className="mb-3 font-medium text-3xl text-gray-200 ">
              {data?.totalUser}
            </p>
          </div>
          <div className=" w-56 text-center border mx-auto px-8 py-3 rounded-lg shadow bg-yellow-400 border-yellow-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Total Password
            </h5>

            <p className="mb-3 font-medium text-3xl text-gray-200 ">
              {data?.totalPassword}
            </p>
          </div>
          <div className=" w-56 text-center border mx-auto px-8 py-3 rounded-lg shadow bg-blue-400 border-blue-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Total Notes
            </h5>

            <p className="mb-3 font-medium text-3xl text-gray-200 ">
              {data?.totalNotes}
            </p>
          </div>
          <div className=" w-56 text-center border mx-auto px-8 py-3 rounded-lg shadow bg-green-400 border-green-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Blocked Users
            </h5>

            <p className="mb-3 font-medium text-3xl text-gray-200 ">
              {data?.totalLockedUser}
            </p>
          </div>
        </div>

        <div className="w-full  mx-auto sm:mx-0 max-w-md p-4 border rounded-lg shadow sm:p-8 bg-gray-800 border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Latest Users
            </h5>
            <Link
              to={"/admin/users"}
              className="text-sm font-medium hover:underline text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="">
            <ul role="list" className="divide-y divide-gray-700">
              {data?.allUser.map((item, index) => (
                <li key={index} className="py-3 sm:py-4 ">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={item.profileImg}
                        alt="Neil image"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium  truncate text-white">
                        {item.firstName} {item.lastName}
                      </p>
                      <p className="text-sm truncate text-gray-400">
                        {item.email}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div></div>
        <div></div>
      </main>
    </main>
  );
};

export default Dashboard;
