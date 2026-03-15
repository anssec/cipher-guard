import FeaturesCompnent from "../../components/FeaturesCompnent.jsx";
import meterImg from "../../assets/meter.png";
import emergencyImg from "../../assets/emergency.png";
import exportImg from "../../assets/export-file.png";
import passwordImg from "../../assets/WebsitePassword.png";
const Features = () => {
  return (
    <div className=" flex justify-between flex-wrap mt-8 mb-5">
      {/* leftDiv */}
      <div className=" lg:w-1/2 w-full flex flex-col justify-center xl:items-start items-center lg:flex-none">
        <div>
          <FeaturesCompnent
            heading={"Password Strength Meter"}
            content={
              "Provide a visual indicator of password strength to encourage users to create strong passwords."
            }
            img={meterImg}
          />
        </div>
        <div>
          <FeaturesCompnent
            heading={"Emergency Access"}
            content={
              "Implement a feature that allows users to designate trusted contacts who can access their account in case of emergencies."
            }
            img={emergencyImg}
          />
        </div>
        <div>
          <FeaturesCompnent
            heading={"Import/Export Functionality"}
            content={
              "Provide the ability to import/export passwords to and from various file formats for easy migration."
            }
            img={exportImg}
          />
        </div>
      </div>

      {/* rightDiv */}
      <div className="w-full flex justify-center items-center lg:mr-4 lg:w-fit">
        <img src={passwordImg} className=" lg:w-full w-60" />
      </div>
    </div>
  )
}

export default Features