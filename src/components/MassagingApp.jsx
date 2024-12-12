import { get, getDatabase, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context";
import { useParams, NavLink } from "react-router-dom";
import { onValue, push, set } from "firebase/database";

const MessagingApp = () => {
  const [selectedUsersData, setSelectedUsersData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [SID, setSID] = useState("");
  const [RID, setRID] = useState("");
  const { id } = useParams();
  const { oneUser, theam } = useContext(AppContext);
  const senderId = oneUser[0].xx0c3w8d;

  const generateInitials = (name) => {
    const nameParts = name.split(" ");
    const firstNameInitial = nameParts[0]?.[0]?.toUpperCase();
    const lastNameInitial = nameParts[1] ? nameParts[1][0].toUpperCase() : "";
    return `${firstNameInitial}${lastNameInitial}`;
  };

  // Fetch selected users
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

  // Split the URL ID to get sender and receiver IDs
  const splitingID = () => {
    const [senderURLId, receiverURLId] = id.split("_");
    if (senderURLId === senderId) {
      setSID(senderURLId);
      setRID(receiverURLId);
    } else {
      setSID(receiverURLId);
      setRID(senderURLId);
    }
  };

  useEffect(() => {
    fetchSelectedUsers();
    splitingID();
  }, []);

  // Fetch messages from Firebase
  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, `messages/${id}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]); // If no messages, clear the array
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }
    try {
      const db = getDatabase();
      const messagesRef = ref(db, `messages/${id}`);
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        senderId: SID,
        receiverId: RID,
        message: message.trim(),
        timestamp: Date.now(),
      });

      setMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Format date and time
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = date.toLocaleTimeString([], options);

    return {
      date: date.toLocaleDateString(), // Format date (e.g., "5/10/2024")
      time: formattedTime, // Format time as "10:17 PM"
    };
  };

  const renderMessages = () => {
    let lastDate = "";
    return messages.map((msg, index) => {
      const { date, time } = formatDate(msg.timestamp);
      const isNewDay = lastDate !== date;

      if (isNewDay) {
        lastDate = date;
      }

      return (
        <div key={msg.id}>
          {isNewDay && (
            <div
              className={`text-center  my-2 text-gray-500 font-semibold text-sm`}
            >
              {date}
            </div>
          )}
          <div
            style={{ color: "#007bff" }}
            className={`flex ${
              msg.senderId === SID ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`${
                msg.senderId === SID
                  ? "bg-green-300 text-teal-700"
                  : "bg-gray-200 text-gray-800"
              } flex pl-2 pr-2 pt-1 pb-1 rounded-ss-xl rounded-br-xl max-w-xs break-words shadow-md`}
            >
              <div>{msg.message}</div>
              <div className="text-xs ml-1 mt-3 text-gray-500 ">{time}</div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">
        Conversation
      </h2>

      {/* Selected Users Section */}
      <div className="relative p-6 bg-gray-100 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Selected Users:
        </h2>

        {selectedUsersData.length === 0 ? (
          <p className="text-gray-500">No users selected yet.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {selectedUsersData.map((item) => (
              <div
                key={item.uniqueID}
                className="flex items-center justify-between bg-white p-4 mb-4 rounded-lg border-2 border-gray-200 hover:bg-purple-200 transition duration-300"
              >
                <NavLink
                  to={`conversation/${
                    item.uniqueID < oneUser[0].uniqueID
                      ? `${item.uniqueID}_${oneUser[0].uniqueID}`
                      : `${oneUser[0].uniqueID}_${item.uniqueID}`
                  }`}
                  className="flex items-center space-x-4 w-full"
                >
                  <div className="flex items-center space-x-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={`${item.name}'s avatar`}
                        className="w-12 h-12 rounded-full border-2 border-teal-500"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-full">
                        {generateInitials(item.name)}
                      </div>
                    )}
                    <div className="text-gray-700 font-medium">{item.name}</div>
                  </div>
                  <div className="text-teal-600">Start Conversation</div>
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation Section */}
      <div
        className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg overflow-hidden"
        style={{ height: "80vh" }}
      >
        <div
          className="overflow-y-auto p-6 space-y-4"
          style={{ height: "calc(100% - 150px)" }}
        >
          {messages.length > 0 ? (
            renderMessages()
          ) : (
            <p className="text-center text-gray-400">No messages yet.</p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex items-center justify-between bg-gray-50 p-4 border-t border-gray-200"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="1"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="ml-4 bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagingApp;
