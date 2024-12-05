import { get, getDatabase, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "./context";

const Login = () => {
  const [userData, setUserData] = useState([]);
  const [id, setId] = useState("");
  const { setOneUser } = useContext(AppContext);
  const [text, setText] = useState("");
  const nav = useNavigate();

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
        setUserData(arrayData);
        console.log("Array of objects retrieved:", arrayData);
        return snapshot.val();
      } else {
        console.log("No data available at this path.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      const exist = userData.filter((item) => {
        return item.password === id;
      });
      if (exist.length === 1) {
        nav("/userList");
        setOneUser(exist);
      } else {
        alert("User ID does not exist");
      }
    }
  };
  // Function to handle pasting the clipboard content
  const pasteFromClipboard = async () => {
    try {
      // Read text from the clipboard
      const clipboardText = await navigator.clipboard.readText();

      // Set the text into the input field
      setId(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            onClick={pasteFromClipboard}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Paste
          </button>
          <div>
            <label
              htmlFor="ID"
              className="block text-gray-600 font-semibold mb-2"
            >
              Enter Generated Password
            </label>
            <input
              required
              type="text"
              name="ID"
              id="ID"
              placeholder="Enter Unique ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Submit
          </button>
          <div className="text-xs">
            If you don’t have an account, please proceed to the{" "}
            <NavLink to="/" className="text-blue-600 underline">
              Registration
            </NavLink>{" "}
            page to create one!
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
