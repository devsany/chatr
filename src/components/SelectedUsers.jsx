import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "./context";
import { NavLink } from "react-router-dom";

const SelectedUsers = () => {
  const [selectedUsersData, setSelectedUsersData] = useState([]);
  const { oneUser } = useContext(AppContext);

  const fetchSelectedUsers = async () => {
    try {
      const db = getDatabase();

      // Fetch selected user uniqueIDs
      const userSelectionRef = ref(db, `userSelections/${oneUser[0].uniqueID}`);
      const selectionSnapshot = await get(userSelectionRef);

      if (selectionSnapshot.exists()) {
        const selecteduniqueIDs = selectionSnapshot.val();

        // Fetch user details for the selected uniqueIDs
        const dbRef = ref(db, "users");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const allUsers = Object.keys(snapshot.val()).map((key) => ({
            id: key,
            ...snapshot.val()[key],
          }));

          const selectedUsers = allUsers.filter((user) =>
            selecteduniqueIDs.includes(user.uniqueID)
          );

          setSelectedUsersData(selectedUsers);
        }
      }
    } catch (error) {
      console.error("Error fetching selected users:", error);
    }
  };
  // Function to generate initials for the avatar
  const generateInitials = (name) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0]?.[0]?.toUpperCase();
    const lastNameInitial = nameParts[1] ? nameParts[1][0].toUpperCase() : "";
    return `${firstNameInitial}${lastNameInitial}`;
  };
  useEffect(() => {
    fetchSelectedUsers();
  }, []);

  return (
    <div className="relative p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Blurred background div */}
      <div className="absolute inset-0 bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-lg"></div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">
        My Selected Users:
      </h2>

      {selectedUsersData.length === 0 ? (
        <p className="text-gray-500 relative z-10">No users selected yet.</p>
      ) : (
        <div className="relative z-10 max-h-96 overflow-y-auto">
          {selectedUsersData.map((item) => {
            return (
              <div
                key={item.uniqueID}
                className="flex items-center justify-between bg-white p-4 mb-4 rounded-lg border-2 border-gray-200 hover:bg-purple-200 transition duration-300"
              >
                <NavLink
                  state={{ item }}
                  to={`conversation/${ 
                    item.uniqueID < oneUser[0].uniqueID
                      ? `${item.uniqueID}_${oneUser[0].uniqueID}`
                      : `${oneUser[0].uniqueID}_${item.uniqueID}`
                  }`}
                  className="flex items-center space-x-4 w-full"
                >
                  <div className="flex items-center space-x-3">
                    {/* Display Avatar */}
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={`${item.name}'s avatar`}
                        className="w-12 h-12 rounded-full border-2 border-teal-500"
                      />
                    ) : (
                      // If no avatar, show initials
                      <div className="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-full">
                        {generateInitials(item.name)}
                      </div>
                    )}
                    <div className="text-gray-700 font-medium">{item.name}</div>
                  </div>
                  <div className="text-teal-600">Start Conversation</div>
                </NavLink>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedUsers;
