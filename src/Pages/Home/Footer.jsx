import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <>
    <div className="h-0.5 w-full bg-neutral-600 mt-20"></div>
      <div className="flex flex-col lg:h-28 h-fit mt-4 lg:mt-0 lg:flex-row justify-between lg:items-center gap-14 lg:0 text-white p-4">
        <Link to={"/"}>
          <img
            className="cursor-pointer w-36"
            src={Logo}
            alt="CipherGuard logo"
          />
        </Link>
        <div className="text-sm  flex flex-col lg:flex-row font-semibold">
          © CipherGuard 2023
          <a href="/privacy-policy" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Privacy policy
          </a>
          <a href="/cookies-policy" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Cookies policy
          </a>
          <a href="/terms-of-use" className="ml-4 lg:mt-0 mt-4 hover:underline">
            Terms of use
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
