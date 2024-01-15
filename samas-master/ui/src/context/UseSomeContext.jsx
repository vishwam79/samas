import React, { useEffect } from "react";
import createSomeContext from "./createSomeContext";
import ServerUrl from "../assets/links/ServerUrl";

const token = sessionStorage.getItem("token");

export default function UseSomeContext(props) {
  const serverUrl = ServerUrl();

  //    // Use the useState hook to manage the token
  // const [token, setToken] = React.useState(null);

  // useEffect(() => {
  //     const storedToken = sessionStorage.getItem("token");
  //     setToken(storedToken);
  // }, []);

  // for opening and closing sidebar in big devices
  const [openSidebar, setOpenSidebar] = React.useState(true);

  // for storing the profile data
  const [profileData, setProfileData] = React.useState();

  // //! login
  const login = async (email, password) => {
    const res = await fetch(`${serverUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.clone().json();
    if (json.success === true) {
      // console.log(json);
      sessionStorage.setItem("token", json.token);
      setProfileData(json.data);
    }
    return res;
  };

  // //! create user (person)
  const createPerson = async (
    name,
    email,
    employeeID,
    mobile,
    whatsappNo,
    password,
    department,
    ageGroup,
    address,
    role
  ) => {
    const res = await fetch(`${serverUrl}/api/v1/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // "Authorization": `Bearer ${token}`
        token: token,
      },
      // credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        employeeID,
        mobile,
        whatsappNo,
        password,
        department,
        ageGroup,
        address,
        role,
      }),
    });
    const json = await res.clone().json();
    console.log(json);
    return res;
  };

  // //! fetch all persons of one common role
  const fetchCommonRolePerson = async (role) => {
    const res = await fetch(
      `${serverUrl}/api/v1/fetchCommonRolePerson/?role=${role}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: token,
        },
      }
    );
    return res;
  };

  // //! fetch persons's with the help of creatorBDId
  const fetchPersonsByRoleAndCreatorDBId = async (role, creatorDBId) => {
    const res = await fetch(
      `${serverUrl}/api/v1/fetchPersonsByRoleAndCreatorDBId/?role=${role}&creatorDBId=${creatorDBId}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: token,
        },
      }
    );
    return res;
  };

  // //! delete Person By Id
  const deletePersonById = async (personId) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/deletePersonById`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ personId }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! block/un-block person by Id
  const changeStatusOfThePersonById = async (personId, status) => {
    const res = await fetch(`${serverUrl}/api/v1/changeStatusOfThePerson`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({ personId, status }),
    });
    return res;
  };

  // //! fetch profile data
  const [loading, setLoading] = React.useState(false);
  const getMyProfile = async () => {
    setLoading(true);
    console.log("Get my profile....");
    const res = await fetch(`${serverUrl}/api/v1/getMyProfile`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        // "Authorization": `Bearer ${token}`
        token: token,
      },
    });
    const json = await res.clone().json();
    console.log(json);
    if (json.success === true) {
      setProfileData(json.data);
    }
    setLoading(false);
    return res;
  };
  useEffect(() => {
    if (!profileData) {
      getMyProfile();
    }
  }, []);

  // //! send otp
  const sendOtp = async (email) => {
    const res = await fetch(`${serverUrl}/api/v1/sendOtp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    return res;
  };

  // //! verify otp
  const verifyOtp = async (otp, email) => {
    const res = await fetch(`${serverUrl}/api/v1/verifyOtp`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        otp,
        email,
      }),
    });
    return res;
  };

  // //! update password
  const updatePassword = async (otp, email, password) => {
    const res = await fetch(`${serverUrl}/api/v1/updatePassword`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        otp,
        email,
        password,
      }),
    });
    return res;
  };

  // //! update my profile viva otp  (update our own profile)
  const updateMyProfileVivaOtp = async (
    otp,
    name,
    email,
    mobile,
    whatsappNo,
    ageGroup,
    address,
    imgUrl
  ) => {
    console.log(otp, name, email, mobile, whatsappNo, ageGroup, address);
    try {
      const res = await fetch(`${serverUrl}/api/v1/updateMyProfileVivaOtp`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          otp,
          name,
          email,
          mobile,
          whatsappNo,
          ageGroup,
          address,
          imgUrl,
        }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! post a task
  const newTask = async (date, taskName, description, workHalf) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/addTask`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          date,
          taskName,
          description,
          workHalf,
        }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! fetch All Task that is created by you
  const fetchAllTaskCreatedByYou = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/fetchAllTaskCreatedByYou`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: token,
        },
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! fetch All Task that is created by you viva date
  const fetchAllTaskCreatedByYouVivaDate = async (startDate, endDate) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/fetchAllTaskCreatedByYouVivaDate/?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! fetch All Task that is created by you viva date and page info
  const fetchAllTaskCreatedByYouVivaDateAndPageInfo = async (startDate, endDate, pageSize, pageNo) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/fetchAllTaskCreatedByYouVivaDateAndPageInfo/?startDate=${startDate}&endDate=${endDate}&pageSize=${pageSize}&pageNo=${pageNo}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! view Others Tasks
  const viewOthersTasks = async (authorRole, higherAuthorityDBId) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/viewOthersTasks/?authorRole=${authorRole}&higherAuthorityDBId=${higherAuthorityDBId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! view others tasks viva date
  const viewOthersTasksVivaDateAndPageInfo = async (
    authorRole,
    higherAuthorityDBId,
    startDate,
    endDate,
    pageNo,
    pageSize,
  ) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/viewOthersTasksVivaDateAndPageInfo/?authorRole=${authorRole}&higherAuthorityDBId=${higherAuthorityDBId}&startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! view Others Tasks WithOut HigherAuthority DBId
  const viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo = async (
    authorRole,
    startDate,
    endDate,
    pageNo,
    pageSize,
  ) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo/?authorRole=${authorRole}&startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! update task status value by task db id
  const updateStatusOfTheTask = async (statusValue, dbId) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/handleStatusUpdate`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ statusValue, dbId }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! update task remark field
  const updateTaskFields = async (fieldName, value, dbId) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/handleOtherFieldUpdate`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ fieldName, value, dbId }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! delete Task By database Id
  const deleteTaskByDBId = async (taskDBId) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/deleteTaskByDBId`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ taskDBId }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! ---------------------------------------------Start of Task Allocation-----------------------------------------
  // //! allocate new task
  const allocateNewTask = async (
    allocatedToDBId,
    allocatedByDBId,
    taskName,
    taskDesc,
    startDate,
    deadline
  ) => {
    try {
      const res = await fetch(`${serverUrl}/api/v1/allocateNewTask`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          allocatedToDBId,
          allocatedByDBId,
          taskName,
          taskDesc,
          startDate,
          deadline,
        }),
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! view allocated task to any person viva date
  const viewAllocatedTaskVivaDate = async (
    allocatedToDBId,
    startDate,
    endDate
  ) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/viewAllAllocatedTaskVivaDate/?allocatedToDBId=${allocatedToDBId}&startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! view allocated task to any person viva date and page info
  const viewAllocatedTaskVivaDateAndPageInfo = async (
    allocatedToDBId,
    startDate,
    endDate,
    pageNo,
    pageSize,
  ) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/v1/viewAllAllocatedTaskVivaDateAndPageInfo/?allocatedToDBId=${allocatedToDBId}&startDate=${startDate}&endDate=${endDate}&pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // //! handle filed value update
  const handleFieldValueUpdateOfTheAllocatedTask = async (
    fieldName,
    value,
    taskDBId,
    allocatedByDBId
  ) => {
    const res = await fetch(`${serverUrl}/api/v1/updateParticularField`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({ fieldName, value, taskDBId, allocatedByDBId }),
    });
    return res;
  };

  // //! handle field value update of the allocated task without creator id
  const handleFieldValueUpdateWithoutCreatorId = async (
    fieldName,
    value,
    taskDBId
  ) => {
    const res = await fetch(
      `${serverUrl}/api/v1/updateParticularFieldWithoutCreatorPermission`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ fieldName, value, taskDBId }),
      }
    );
    return res;
  };

  // //! handle delete of allocated task
  const handleDeletionOfAllocatedTask = async (taskDBId, allocatedByDBId) => {
    const res = await fetch(`${serverUrl}/api/v1/deleteAllocatedTaskByDBId`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({ taskDBId, allocatedByDBId }),
    });
    return res;
  };
  // //! -----------------------------------------------End of Task Allocation-----------------------------------------

  // //! ......................................start of Lead Generation.........................................
  // generate new lead
  const generateNewLead = async (
    clientName,
    clientDesignation,
    clientOrganisation,
    clientMobileNumber,
    clientWhatsappNumber,
    clientMailId,
    serviceCategories,
    demand,
    firstConversationDate
  ) => {
    const res = await fetch(`${serverUrl}/api/v1/generateNewLead`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({
        clientName,
        clientDesignation,
        clientOrganisation,
        clientMobileNumber,
        clientWhatsappNumber,
        clientMailId,
        serviceCategories,
        demand,
        firstConversationDate,
      }),
    });
    const json = await res.clone().json();
    console.log(json);
    return res;
  };

  // Show All Generated Lead By Any One Person
  const showGeneratedLeadsByAnyOnePerson = async (
    generaterDBId,
    startDate,
    endDate
  ) => {
    const res = await fetch(
      `${serverUrl}/api/v1/showGeneratedLeadsByAnyOnePerson/?generaterDBId=${generaterDBId}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: token,
        },
      }
    );
    return res;
  };

  // update field of the lead generation data
  const updateLeadGenerationDataField = async (
    DBId,
    fieldName,
    newFieldValue
  ) => {
    const res = await fetch(
      `${serverUrl}/api/v1/updateLeadGenerationDataField`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: token,
        },
        body: JSON.stringify({ DBId, fieldName, newFieldValue }),
      }
    );
    return res;
  };

  // delete Lead By DBId
  const deleteLeadByDBId = async (DBId) => {
    const res = await fetch(`${serverUrl}/api/v1/deleteLeadByDBId`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        token: token,
      },
      body: JSON.stringify({ leadDBId: DBId }),
    });
    return res;
  };
  // //! .............................................End of Lead Generation .............................................

  return (
    <createSomeContext.Provider
      value={{
        login,
        createPerson,
        fetchCommonRolePerson,
        fetchPersonsByRoleAndCreatorDBId,
        deletePersonById,
        changeStatusOfThePersonById,
        
        // sidebar open and close for big devices
        openSidebar, setOpenSidebar,

        profileData, // useState
        getMyProfile,
        updateMyProfileVivaOtp,

        sendOtp,
        verifyOtp,
        updatePassword,

        newTask,
        fetchAllTaskCreatedByYou,
        fetchAllTaskCreatedByYouVivaDate,
        fetchAllTaskCreatedByYouVivaDateAndPageInfo,
        viewOthersTasks,
        viewOthersTasksVivaDateAndPageInfo,
        viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo,
        updateStatusOfTheTask,
        updateTaskFields,
        deleteTaskByDBId,

        // task allocation
        allocateNewTask,
        viewAllocatedTaskVivaDate,// all allocated task to any particular person
        viewAllocatedTaskVivaDateAndPageInfo, // all allocated task to any particular person
        handleFieldValueUpdateOfTheAllocatedTask,
        handleFieldValueUpdateWithoutCreatorId,
        handleDeletionOfAllocatedTask,

        // lead generation
        generateNewLead,
        showGeneratedLeadsByAnyOnePerson,
        updateLeadGenerationDataField,
        deleteLeadByDBId,
      }}
    >
      {props.children}
    </createSomeContext.Provider>
  );
}
