import React, { useEffect, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaEyeSlash, FaTrashAlt, FaEye } from "react-icons/fa";
import { RxOpenInNewWindow } from "react-icons/rx";
import CryptoJS from "crypto-js";
import { toast } from "react-hot-toast";
import { useCookies } from "react-cookie";

const EditPasswdUsername = ({
  isOpen,
  onClose,
  onConfirm,
  onTrash,
  onUserData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    website: "",
  });
  const [cookies] = useCookies(["cookie-name"]);
  const v_Pin = cookies["v_pin"];
  const [showPasswd, setShowPasswd] = useState(false);

  useEffect(() => {
    setFormData({
      name: onUserData.name,
      username: onUserData.username,
      password: onUserData.password,
      website: onUserData.website,
    });
  }, [onUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(formData, onUserData._id);
  };

  const showPasswdHandler = () => {
    setShowPasswd((prev) => !prev);
    if (!showPasswd) {
      const decode = CryptoJS.AES.decrypt(
        v_Pin,
        import.meta.env.VITE_SECUREPIN
      ).toString(CryptoJS.enc.Utf8);
      const decodePasswd = CryptoJS.AES.decrypt(
        onUserData.password,
        decode
      ).toString(CryptoJS.enc.Utf8);
      setFormData((prevData) => ({
        ...prevData,
        password: decodePasswd,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        password: onUserData.password,
      }));
    }
  };

  const handleCancel = () => {
    setShowPasswd(false);
    onClose();
  };

  const usernameCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.username);
      toast.success("Username copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const passwordCopyToClipboard = async () => {
    if (showPasswd) {
      try {
        await navigator.clipboard.writeText(formData.password);
        toast.success("Password copied");
      } catch (err) {
        toast.error("Failed to copy");
      }
    }
  };

  const urlCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.website);
      toast.success("URL copied");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-5 "></div>

        <div className="relative bg-white p-8 w-96 rounded-xl">
          <div className="flex flex-col">
            <div className=" flex justify-between items-center">
              <p className="text-2xl font-semibold uppercase text-black">
                Edit item
              </p>
            </div>

            <div className=" flex flex-col my-4 gap-2">
              <div className=" flex flex-col">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  className=" bg-neutral-50 focus:outline-none border  border-neutral-400 rounded-md p-2"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className=" flex flex-col">
                <label htmlFor="edit-username">Username</label>
                <div className=" flex w-full">
                  <input
                    id="edit-username"
                    className=" bg-neutral-50 w-[90%] focus:outline-none border  border-neutral-400 rounded-l-md p-2"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <div
                    className="bg-neutral-50 w-12 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md"
                    onClick={usernameCopyToClipboard}
                  >
                    <MdOutlineContentCopy className=" w-7 h-7 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className=" flex flex-col">
                <label htmlFor="edit-password">Password</label>
                <div className=" flex w-full">
                  <input
                    id="edit-password"
                    className={` bg-neutral-50 w-[80%] focus:outline-none border  border-neutral-400 rounded-l-md p-2 ${
                      showPasswd ? "" : "cursor-not-allowed"
                    }`}
                    type={showPasswd ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!showPasswd}
                  />
                  <div
                    className="bg-neutral-50 w-12 h-12 border cursor-pointer flex items-center justify-center border-neutral-400"
                    onClick={showPasswdHandler}
                  >
                    {showPasswd ? (
                      <FaEye className=" w-7 h-7" />
                    ) : (
                      <FaEyeSlash className=" w-7 h-7" />
                    )}
                  </div>
                  <div
                    className="bg-neutral-50 w-12 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md"
                    onClick={passwordCopyToClipboard}
                  >
                    <MdOutlineContentCopy
                      className={`${
                        showPasswd ? "cursor-pointer" : "cursor-not-allowed"
                      } w-7 h-7`}
                    />
                  </div>
                </div>
              </div>
              <div className=" flex flex-col">
                <label htmlFor="edit-website">URL</label>
                <div className=" flex w-full">
                  <input
                    id="edit-website"
                    className=" bg-neutral-50 w-[80%] focus:outline-none border  border-neutral-400 rounded-l-md p-2"
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                  <div className="bg-neutral-50 w-12 h-12 border flex items-center justify-center border-neutral-400">
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RxOpenInNewWindow className=" w-7 h-7" />
                    </a>
                  </div>
                  <div
                    className="bg-neutral-50 w-12 h-12 border flex items-center justify-center border-neutral-400 rounded-r-md"
                    onClick={urlCopyToClipboard}
                  >
                    <MdOutlineContentCopy className=" w-7 h-7 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div>
                <p>Created: {onUserData.Created}</p>
                <p>Updated: {onUserData.Updated ? onUserData.Updated : "NA"}</p>
                <p>Password History: {onUserData.passwordHistory}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center transition-all">
            <div>
              <button
                className="px-4 py-2 text-white hover:text-neutral-100 bg-black rounded-md"
                onClick={handleConfirm}
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
            <button
              className="ml-2 p-3 text-red-600 border border-neutral-500 hover:bg-neutral-100 bg-white rounded-md"
              onClick={onTrash}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPasswdUsername;
