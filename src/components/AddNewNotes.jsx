import React, { useState } from "react";

const AddNewNotes = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: "",
    note: "",
    favorite: false,
    lockNote: false,
  });


  //* Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckedChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      note: "",
      favorite: false,
      lockNote: false,
    });
    onClose();
  };
  const handleSaveData = async (e) => {
    e.preventDefault();
    localStorage.setItem("New_Note",  JSON.stringify(formData));
    onConfirm();
    isOpen
      ? setFormData({
          name: "",
          note: "",
          favorite: false,
          lockNote: false,
        })
      : "";
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative bg-white p-8 w-96 rounded-md shadow-lg">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold uppercase text-black">
                Add New Note
              </p>
            </div>
            <form className="flex flex-col my-4 gap-2">
              <div className="flex flex-col">
                <label htmlFor="name">Name</label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md p-2"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="note">Note</label>
                <div className="flex w-full">
                  <textarea
                    className="bg-neutral-50 max-h-24 min-h-24 focus:outline-none border border-neutral-400 rounded-l-md p-2"
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="name">Favorite Note: </label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md accent-black p-2"
                  type="checkbox"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={handleCheckedChange}
                />
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="lockNote">Encrypt Note: </label>
                <input
                  className="bg-neutral-50 focus:outline-none border border-neutral-400 rounded-md accent-black p-2"
                  type="checkbox"
                  name="lockNote"
                  checked={formData.lockNote}
                  onChange={handleCheckedChange}
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
  );
};

export default AddNewNotes;
