import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { AppContext } from "./context";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import SelectedUsers from "./SelectedUsers";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [SID, setSID] = useState("");
  const [RID, setRID] = useState("");
  const { id } = useParams();
  const { oneUser } = useContext(AppContext);
  const senderId = oneUser[0].uniqueID;
  const location = useLocation();
  console.log(location.state.item);
  // const {  item.name, item.uniqueName, item.avatar } = location.state || {}; // Destructure the passed state
  console.log(oneUser);
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

    // Format the time in 12-hour format with AM/PM
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = date.toLocaleTimeString([], options);

    return {
      date: date.toLocaleDateString(), // Format date (e.g., "5/10/2024")
      time: formattedTime, // Format time as "10:17 PM"
    };
  };

  // Render messages with date if different
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
            <div className="text-center my-2 text-gray-500 font-semibold text-sm">
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
              } flex  pl-2 pr-2 pt-1 pb-1 rounded-ss-xl rounded-br-xl max-w-xs break-words shadow-md`}
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
    <div className="">
      <div className="bg-gray-100 h-[100%] p-6">
        <div>
          <NavLink
            className="bg-blue-500 pl-2 pr-2 pt-1 pb-1 rounded-md font-semibold text-white shadow-md hover:bg-blue-700"
            to="/selected-users"
          >
            Back
          </NavLink>
        </div>
        <div
          className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg pb-5 overflow-hidden"
          style={{ height: "80vh" }}
        >
          <div className="border-b  ">
            <div className="flex items-center">
              <div>
                <img
                  src={location.state.item?.avatar}
                  className="w-12 h-12 rounded-full m-1 border-blue-400 border p-1"
                  alt=""
                />
              </div>
              <div>{location.state.item?.avatarName}</div>
            </div>
            <div className="flex">
              <div className="ml-2 font-semibold text-xl">
                {location.state.item?.name}
              </div>
              <div className="ml-2 font-thin text-xl">
                ({location.state.item?.uniqueName})
              </div>
            </div>
          </div>
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
          {/* Message Input Area */}
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
    </div>
  );
};

export default Conversation;
