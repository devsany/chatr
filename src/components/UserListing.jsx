import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { get, getDatabase, push, ref, set } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "./context";
import { doc, setDoc } from "firebase/firestore";
import app from "../firebase/firestore";

const UserListing = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { oneUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [privateUserUniqueId, setPrivateUserUniqueId] = useState("");
  const handleOpenMessageBox = (connectUniqueId) => {
    setPrivateUserUniqueId(connectUniqueId);
    setIsMessageBoxVisible(true);
  };
  const handleCloseMessageBox = () => {
    setIsMessageBoxVisible(false);
    setMessage("");
  };
  console.log(privateUserUniqueId);
  const handleSendRequest = async () => {
    try {
      const notificationId = `${privateUserUniqueId}_${
        oneUser[0].uniqueID
      }_${Date.now()}`;

      const db = getDatabase();
      const messagesRef = ref(db, `notification/${notificationId}`);
      const notificationRef = push(messagesRef);
      await set(notificationRef, {
        toUserId: privateUserUniqueId,
        fromUserId: oneUser[0].uniqueID,
        message: message,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      console.log("Notification sent!");
      console.log("Message Sent:", message);

      // Hide message box and clear the message input field
      setIsMessageBoxVisible(false);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    // try {
    //   // Use Firestore for storing notifications
    //   const db = getDatabase(); // Firestore initialization
    //   const notificationId = `${privateUserUniqueId}_${
    //     oneUser[0].uniqueID
    //   }_${Date.now()}`;

    //   const notificationRef = doc(db, "notifications", notificationId);

    //   // Store notification in Firestore
    //   await setDoc(notificationRef, {
    //     toUserId: privateUserUniqueId,
    //     fromUserId: oneUser[0].uniqueID,
    //     message: message,
    //     status: "pending",
    //     createdAt: new Date().toISOString(),
    //   });

    //   console.log("Notification sent!");
    //   console.log("Message Sent:", message);

    //   // Hide message box and clear the message input field
    //   setIsMessageBoxVisible(false);
    //   setMessage("");
    // } catch (error) {
    //   console.error("Error sending notification:", error);
    // }
  };
  console.log(oneUser);
  const fetchData = async () => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, "users");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const arrayData = Array.isArray(snapshot.val())
          ? snapshot.val()
          : Object.keys(snapshot.val()).map((key) => ({
              id: key,
              ...snapshot.val()[key],
            }));

        const mainUserList = arrayData.filter(
          (item) => item.uniqueID !== oneUser[0].uniqueID
        );
        setUserData(mainUserList);

        // Fetch previously selected users from Firebase
        const userSelectionRef = ref(
          db,
          `userSelections/${oneUser[0].uniqueID}`
        );
        const selectionSnapshot = await get(userSelectionRef);

        if (selectionSnapshot.exists()) {
          setSelectedUsers(selectionSnapshot.val());
        }
      } else {
        console.log("No data available at this path.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(userData);
  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectUser = async (user) => {
    const updatedSelectedUsers = selectedUsers.includes(user.uniqueID)
      ? selectedUsers.filter((uniqueID) => uniqueID !== user.uniqueID)
      : [...selectedUsers, user.uniqueID];

    setSelectedUsers(updatedSelectedUsers);

    // Save updated selection to Firebase
    const db = getDatabase();
    const userSelectionRef = ref(db, `userSelections/${oneUser[0].uniqueID}`);
    await set(userSelectionRef, updatedSelectedUsers);
  };

  const navigateToSelectedUsers = () => {
    navigate("/selected-users");
  };

  const filteredUsers = userData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleRemoveUser = async (uniqueID) => {
    const updatedSelectedUsers = selectedUsers.filter((id) => id !== uniqueID);

    setSelectedUsers(updatedSelectedUsers);

    // Update Firebase with the new selected users list
    const db = getDatabase();
    const userSelectionRef = ref(db, `userSelections/${oneUser[0].uniqueID}`);
    await set(userSelectionRef, updatedSelectedUsers);
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-br from-white to-gray-100 min-h-screen">
      {/* Main User List */}
      <div className="md:w-2/3 bg-white shadow-xl rounded-lg p-6 border-4 border-red-300">
        <div className="text-2xl font-bold text-gray-800 mb-6">
          User Logged In:{" "}
          <span className="text-red-600">{oneUser[0]?.name || "Guest"}</span>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <small className="block mt-2 text-gray-500">
            Use the search bar to find specific users.
          </small>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-red-300 pb-2">
          All Users ({filteredUsers.length} Found)
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar bg-red-50 p-4 rounded-lg">
          {filteredUsers.map((item) => (
            <div
              key={item.uniqueID}
              className="flex items-center justify-between border border-gray-300 p-4 rounded-lg bg-white"
            >
              <div className="flex items-center   space-x-4">
                <button
                  onClick={() => {
                    if (item.selectAccountStatus !== "makePrivantAccount") {
                      handleSelectUser(item);
                    }
                  }}
                  className={`md:flex items-center space-x-2 px-4 py-2 rounded ${
                    item.selectAccountStatus === "makePrivantAccount"
                      ? "text-gray-400 cursor-not-allowed bg-gray-200"
                      : "text-red-500 bg-white hover:bg-red-100"
                  }`}
                  disabled={item.selectAccountStatus === "makePrivantAccount"}
                >
                  {item.selectAccountStatus === "makePrivantAccount" && (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-500"
                      >
                        <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9zm3 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                      </svg>
                    </div>
                  )}
                  {selectedUsers.includes(item.uniqueID) ? (
                    <MdCheckBox size={24} />
                  ) : (
                    <MdCheckBoxOutlineBlank size={24} />
                  )}
                  <span
                    className={`font-medium ${
                      item.selectAccountStatus === "makePrivantAccount"
                        ? "text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {selectedUsers.includes(item.uniqueID)
                      ? "Select"
                      : "Diselect"}
                  </span>
                </button>

                <div className="md:flex md:justify-between  items-center">
                  <div className="flex items-center  ">
                    <img
                      src={item.avatar}
                      className="rounded-full w-12 h-12 border-2 border-red-400"
                      alt={`${item.name}'s avatar`}
                    />
                    <div className="ml-3 text-red-700 font-semibold">
                      {item.name} - {item.uniqueName}
                    </div>
                  </div>
                  <div>
                    {/* Trigger Button */}
                    {item.selectAccountStatus === "makePrivantAccount" ? (
                      <>
                        <button
                          onClick={() => handleOpenMessageBox(item.uniqueID)}
                          className="px-2 py-1  bg-blue-500 text-white rounded-full ml-4 text-xs shadow-md hover:bg-blue-600"
                        >
                          Request to Connect
                        </button>
                        {isMessageBoxVisible && (
                          <div className="fixed inset-0   flex items-center justify-center">
                            <div className="absolute flex items-center bg-opacity-50   justify-center  min-w-full min-h-full   bg-slate-500">
                              <div className="  bg-white w-96 rounded-lg shadow-lg p-6 relative">
                                {/* Close Button */}
                                <button
                                  onClick={handleCloseMessageBox}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.225 4.811a.75.75 0 011.06-.034L12 9.432l4.715-4.655a.75.75 0 111.06 1.06L13.063 10.5l4.715 4.655a.75.75 0 11-1.06 1.06L12 11.568l-4.715 4.655a.75.75 0 11-1.06-1.06l4.715-4.655-4.715-4.655a.75.75 0 01-.034-1.06z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>

                                {/* Label */}
                                <label
                                  htmlFor="message"
                                  className="block text-gray-700 mb-2"
                                >
                                  Enter Your Message
                                </label>

                                {/* Input Field */}
                                <input
                                  id="message"
                                  type="text"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                                  placeholder="Type your message here..."
                                />

                                {/* Buttons */}
                                <div className="mt-4 flex justify-end space-x-2">
                                  <button
                                    onClick={handleSendRequest}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    Click to send Request
                                  </button>
                                  <button
                                    onClick={handleCloseMessageBox}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                    {/* Message Box */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Users List */}
      <div className="md:w-1/3 bg-white shadow-xl rounded-lg p-6 border-4 border-blue-300">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-300 pb-2">
          Selected Users ({selectedUsers.length} Selected)
        </h2>
        {selectedUsers.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {selectedUsers.map((uniqueID) => {
              const user = userData.find((user) => user.uniqueID === uniqueID);
              return (
                <div
                  key={uniqueID}
                  className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-blue-300"
                      src={user.avatar}
                      alt={`${user?.name || "Unknown User"}'s avatar`}
                    />
                    <div className="text-gray-800 text-[12px] ml-3 font-medium">
                      {user?.name || "Unknown User"} -{" "}
                      {user.uniqueName || "Unknown User"}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(uniqueID)}
                    className="text-blue-500 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No users selected</p>
        )}
        {selectedUsers.length > 0 && (
          <>
            <button
              onClick={navigateToSelectedUsers}
              className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-md font-semibold"
            >
              View Selected Users
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserListing;
