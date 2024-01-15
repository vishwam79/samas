import React from "react";
import { useContext } from "react";
import createSomeContext from "../../context/createSomeContext";
import { toast } from "react-toastify";
import RotatingTrianglesComp from "../Global/utils/RotatingTriangles";
import ProvideSidebar from "../Global/ProvideReqComp/ProvideSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faChild, faEnvelope, faIdBadge, faLocationArrow, faMobile, faUser } from "@fortawesome/free-solid-svg-icons";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { 
    openSidebar, setOpenSidebar, // for opeining and closing sidebar in big devices

    getMyProfile, profileData, sendOtp, updateMyProfileVivaOtp } =
    useContext(createSomeContext);
  
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [wantsToUpdate, setWantsToUpdate] = React.useState(false);

  const [image, setImage] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");

  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [whatsappNo, setWhatsappNo] = React.useState("");
  const [ageGroup, setAgeGroup] = React.useState("18-24");
  const [address, setAddress] = React.useState("");

  const [otp, setOtp] = React.useState("");
  const [otpSended, setOtpSended] = React.useState(false);
  
  const getProfile = async () => {
    setLoading(true);
    // const res = await getMyProfile();
    // const json = await res.json();
    // if (json.success === true) {
    //   setData(json.data);
    // }
    // else {
    //   toast.error("Error in fetching profile.");
    // }
    setData(profileData);
    setLoading(false);
  };
  React.useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);

  // //! Handle wants to update or not
  const handleWantsTo = async () => {
    setWantsToUpdate(!wantsToUpdate);
  };

  //! // handle image upload
  const uploadImage = async () => {
    // check if an image file is selected
    if (!image) {
      toast.error("Please select an image file.");
      return;
    }
    // check file format(webp)
    if (image.type !== "image/webp") {
      toast.error("Please select a webp image file.");
      return;
    }

    // create an image element to load the selected file
    const imgElement = document.createElement("img");
    // load the selected file into the image element
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      imgElement.onload = () => {
        // check image dimensions (290x220 pixels)
        if (imgElement.width > 300 || imgElement.height > 300) {
          toast.error(
            "Please select an webp image with dimesions less than or equal to 300x300 pixels."
          );
          return;
        } else {
          // now, if all right
          toast.info("Image Uploading...");
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "samasimg");
          data.append("cloud_name", "dzgaixltu");
          fetch("https://api.cloudinary.com/v1_1/dzgaixltu/image/upload", {
            method: "post",
            body: data,
          })
            .then((resp) => resp.json())
            .then((data) => {
              setImgUrl(data.url);
              toast.success("Image Uploaded Successfully...");
            })
            .catch((err) => toast.error("Try again......"));
        }
      };
      imgElement.src = e.target.result;
    };
    fileReader.readAsDataURL(image);
  };

  // //! handle submit : -- for updating information need to send and verify otp
  const sendOtpFunc = async (e) => {
    e.preventDefault();
    if (!data || !data.email) {
      toast.error("Try again.");
      window.location.reload();
      return;
    }
    if (mobile.length !== 10) {
      toast.info("Enter 10 digit mobile number.");
      return;
    }
    if (whatsappNo.length !== 10) {
      toast.info("Enter 10 digit whatsapp number.");
      return;
    }
    setLoading(true);
    const res = await sendOtp(data.email);
    const json = await res.json();
    if (json.success === true) {
      toast.success(json.message);
      setOtpSended(true);
    } else {
      toast.error("Try again.");
      window.location.reload();
    }
    setLoading(false);
  };
  const verfiyOtpAndUpdateInformation = async (e) => {
    if (!data || !data.email) {
      toast.error("Try again.");
      window.location.reload();
      return;
    }

    if (otp.length !== 6) {
      toast.info("Enter 6-digit valid Otp.");
      return;
    }

    // now, finally make a request to api
    setLoading(true);
    // otp, name, email, mobile, whatsappNo, ageGroup, address
    const res = await updateMyProfileVivaOtp(
      otp,
      name,
      data.email,
      mobile,
      whatsappNo,
      ageGroup,
      address,
      imgUrl
    );
    const json = await res.json();
    if (json.success === true) {
      toast.success(json.message);
      setWantsToUpdate(!wantsToUpdate);
      setData(json.data);
    } else {
      toast.error(json.message);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <>
     {/* Sidebar toggle button :- not for small devices :- min-width : 1024px  */}
     <div className="navbar-toggle-test-second">
     {openSidebar ? (
       <button
         type="button"
         onClick={(e) => {
           setOpenSidebar(!openSidebar);
         }}
       >
       <i>
         <FontAwesomeIcon icon={faTimes} />
       </i>
       </button>
     ) : (
       <button type="button" onClick={(e) => setOpenSidebar(!openSidebar)}>
       <i>
         <FontAwesomeIcon icon={faBars} />
       </i>
       </button>
     )}
   </div>

   {/* global-container */}
   <div className="global-container lg:flex">
     {/* side bar component */}
     {openSidebar && <ProvideSidebar />}

      <div className="page-comp w-full min-w-0 flex-auto lg:static lg:max-h-full lg:overflow-visible">
        {loading ? (
          <RotatingTrianglesComp />
        ) : !wantsToUpdate ? (
          <div className="container1">
            <div className="heading">
              <p>Profile</p>
            </div>
            
            <div className="profile-section">
              <div className="profile-image">
                {data && data.imgUrl ? (
                  <img src={data.imgUrl} alt="Nothing" />
                ) : (
                  ""
                )}
              </div>
              <div className="profile-container">
                <div>
                <span>
                <i>
                  <FontAwesomeIcon icon={faIdBadge} />
                </i>
                  Employee ID : </span>
                  <span>{data && data.employeeID}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faUser} />
                  </i>
                  Name : </span>
                  <span>{data && data.name}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faEnvelope}/>
                  </i>
                  Email : </span>
                  <span>{data && data.email}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faMobile} />
                  </i>
                  Mobile No : </span>
                  <span>{data && data.mobile}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faMobile} />
                  </i>
                  Whatsapp No : </span>
                  <span>{data && data.whatsappNo}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faBuilding} />
                  </i>
                  Department : </span>
                  <span>{data && data.department}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faBuilding}/>
                  </i>
                  Role : </span>
                  <span>{data && data.role}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faChild} />
                  </i>
                  Age Group : </span>
                  <span>{data && data.ageGroup}</span>
                </div>
                <div>
                  <span>
                  <i>
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </i>
                  Address : </span>
                  <span>{data && data.address}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8">
              <button
                type="button"
                onClick={(e) => {
                  handleWantsTo();
                }}
                style={{ color: "white" }}
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="container1">
            <div className="heading">
              <p>Update Profile</p>
            </div>
            {!otpSended ? (
              <>
                <div className="form-container">
                  <div className="image-upload-container">
                    <div className="uploaded-image">
                      <img src={imgUrl} alt="nothing" className="" />
                    </div>
                    <p style={{ color: "red" }}>
                      Upload Image in webp format and dimensions must be less
                      than or equal to 300x300 pixels.{" "}
                    </p>
                    <div className="upload-image">
                      <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={{ border: "none" }}
                      />
                      <button
                        onClick={uploadImage}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>

                  <form onSubmit={sendOtpFunc}>
                    <div className="form-heading">
                      <p>Enter Your Information</p>
                    </div>
                    <div className="form-field">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of the BDI"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="mobile">Mobile No</label>
                      <input
                        type="number"
                        id="mobile"
                        name="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile No "
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="whatsappNo">Whatsapp No</label>
                      <input
                        type="number"
                        id="whatsappNo"
                        name="whatsappNo"
                        value={whatsappNo}
                        onChange={(e) => setWhatsappNo(e.target.value)}
                        placeholder="Whatsapp No of the BDI"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label
                        htmlFor="ageGroup"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Age Group
                      </label>
                      <select
                        name="ageGroup"
                        id="ageGroup"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="18-24" selected>
                          18-24
                        </option>
                        <option value="25-30">25-30</option>
                        <option value="31-40">31-40</option>
                        <option value="41-50">41-50</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label htmlFor="address">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        required
                      />
                    </div>
                    <div className="form-buttons">
                      <button type="button" onClick={(e) => handleWantsTo()}>
                        Go Back
                      </button>
                      <button type="submit">Submit</button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <form>
                <div className="form-heading">
                  <p>Verify Otp</p>
                </div>
                <div className="form-field">
                  <input
                    type="number"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit Otp"
                    required
                    className="px-2 py-2 border-2 border-solid border-aqua-300 focus:outline-none"
                  />
                </div>
                <div className="form-buttons">
                  <button type="button" onClick={(e) => setOtpSended(false)}>
                    Go Back
                  </button>
                  <button
                    type="button"
                    onClick={(e) => verfiyOtpAndUpdateInformation()}
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
