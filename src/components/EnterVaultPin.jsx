import { useRef, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { toast } from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import JSCookies from "js-cookie";
import { Link } from "react-router-dom";
// import useVaultPinStore from "../Zustand/Vault_Pin";
const EnterVaultPin = () => {
  const cookies = new Cookies();
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));
  const [vaultPin, setVaultPin] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (index, value) => {
    // Move to the next input if value is entered
    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }

    // Update the vault pin
    const newVaultPin = Array.from({ length: 6 }, (_, i) => {
      return i === index ? value : vaultPin[i] || "";
    }).join("");
    setVaultPin(newVaultPin);
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = cookies.get("token") || localStorage.getItem("token");
    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/vaultAuth`,
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
        setError(false);
        JSCookies.set("v_pin", response.data.data, {
          expires: 1 / 48,
          path: "/",
          secure: true,
          sameSite: "Strict",
        });
        window.location.reload();
        toast.success(response.data.message);
      })
      .catch(function (error) {
        // cookies.set("v_pin", null);
        setErrorMessage(error.response.data.message);
        setError(true);
      });
  };

  return (
    <div className="flex justify-center relative items-center h-full w-full">
      <div className="absolute flex flex-col items-center gap-3">
        <div className="text-center">Enter VaultPin</div>
        {error ? (
          <div className="text-red-500 w-full flex items-center gap-1">
            <MdErrorOutline />
            {errorMessage}
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-row space-x-2">
          {inputRefs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
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
          Go
        </button>
        <Link to={"/settings/create-vault-pin"}
          className="border w-fit px-3 py-1 rounded-lg bg-white text-black"
        >
          Create New
        </Link>
        
      </div>
    </div>
  );
};

export default EnterVaultPin;
