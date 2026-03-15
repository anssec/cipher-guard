import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { CiUnlock } from "react-icons/ci";
import { useCookies } from "react-cookie";
const EditNotes = ({ isOpen, onClose, onConfirm, onTrash, onUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    note: "",
    favorite: false,
  });
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const v_Pin = cookies["v_pin"];
  const [viewNote, setViewNote] = useState(false);
  const [viewNoteLoader, setViewNoteLoader] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckedChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleConfirm = () => {
    const unlockNote = () => {
      onConfirm(formData, onUserData._id); // Pass formData and _id
      setViewNote(false);
      setFormData({
        name: "",
        note: "",
        favorite: false,
      });
    };
    if (onUserData.encrypt) {
      viewNote ? unlockNote() : toast.error("unlock note first");
    } else {
      unlockNote();
    }
  };

  const handleCancel = () => {
    setViewNote(false);
    onClose();
  };
  const handleViewNote = async (data) => {
    if (data.encrypt) {
      setViewNoteLoader(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/note/decodeNote/${data._id}`,
          "",
          {
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: `Bearer ${v_Pin}`,
            },
          }
        );
        setFormData((prevData) => ({
          ...prevData,
          note: response.data.data,
        }));
        setViewNoteLoader(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setViewNoteLoader(false);
      }
    }
    setViewNote((prev) => !prev);
  };

  useEffect(() => {
    setFormData({
      name: onUserData.name,
      note: onUserData.notes, // Ensure note is mapped to notes
      favorite: onUserData.favorite,
    });
  }, [onUserData]);
  const handleOnTrash = () => {
    onTrash();
    setFormData({ name: "", note: "", favorite: false });
  };
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
        <div className="relative bg-white p-8 w-96 rounded-xl">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold uppercase text-black">
                Edit Note
              </p>
            </div>

            <div className="flex flex-col my-4 gap-2">
              <div className="flex flex-col">
                <label htmlFor="name">Name</label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="note">Note</label>
                {onUserData.encrypt ? (
                  viewNote ? (
                    <div className="flex w-full ">
                      <textarea
                        className="bg-neutral-50 max-h-24 min-h-24 focus:outline-none border border-neutral-400 rounded-l-md p-2"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center max-h-24 min-h-24 rounded-md bg-gray-100">
                      <div className="relative w-full h-24 bg-cover bg-center rounded-md overflow-hidden">
                        <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {viewNoteLoader ? (
                            <div className="spinner mx-auto bg-black"></div>
                          ) : (
                            <div
                              className="bg-white/70 text-base font-semibold  flex items-center gap-2 cursor-pointer text-gray-800 rounded-md"
                              onClick={() => handleViewNote(onUserData)}
                            >
                              View Note{" "}
                              <CiUnlock className=" text-lg font-semibold" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex w-full ">
                    <textarea
                      className="bg-neutral-50 max-h-24 min-h-24 focus:outline-none border border-neutral-400 rounded-l-md p-2"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="favorite">Favorite Note:</label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md accent-black p-2"
                  type="checkbox"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={handleCheckedChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center transition-all">
            <div className=" flex">
              <div
                className={`px-4 py-2 text-white hover:text-neutral-100 bg-black rounded-md`}
                onClick={handleConfirm}
              >
                Save
              </div>
              <button
                className="ml-2 px-4 py-2 text-black border hover:bg-neutral-100 border-neutral-500 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

            <button
              className="ml-2 p-3 text-red-600 border border-neutral-500 hover:bg-neutral-100 bg-white rounded-md"
              onClick={handleOnTrash}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNotes;
