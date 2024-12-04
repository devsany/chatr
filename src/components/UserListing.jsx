import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { get, getDatabase, ref, set } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "./context";

const UserListing = () => {
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { oneUser } = useContext(AppContext);
  const navigate = useNavigate();
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSelectUser(item)}
                  className="flex items-center space-x-2 text-red-500"
                >
                  {selectedUsers.includes(item.uniqueID) ? (
                    <MdCheckBox size={24} />
                  ) : (
                    <MdCheckBoxOutlineBlank size={24} />
                  )}
                  <span className="text-gray-600 font-medium">
                    {selectedUsers.includes(item.uniqueID)
                      ? "Deselect"
                      : "Select"}
                  </span>
                </button>
                <div className="flex items-center">
                  <img
                    src={item.avatar}
                    className="rounded-full w-12 h-12 border-2 border-red-400"
                    alt={`${item.name}'s avatar`}
                  />
                  <div className="ml-3 text-red-700 font-semibold">
                    {item.name} - {item.uniqueName}
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
