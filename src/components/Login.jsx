import { get, getDatabase, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./context";

const Login = () => {
  const [userData, setUserData] = useState([]);
  const [id, setId] = useState("");
  const { setOneUser } = useContext(AppContext);
  const nav = useNavigate();
  if (id) {
    userData.filter((item) => {
      return item.uniqueID === id;
    });
  }
  const fetchData = async () => {
    try {
      const db = getDatabase(); // Initialize the Realtime Database
      const dbRef = ref(db, "users"); // Reference to the specific path
      const snapshot = await get(dbRef); // Fetch data

      if (snapshot.exists()) {
        // Convert object to array if needed
        const arrayData = Array.isArray(snapshot.val())
          ? snapshot.val()
          : Object.keys(snapshot.val()).map((key) => ({
              id: key,
              ...snapshot.val()[key],
            }));

        setUserData(arrayData);
        console.log("Array of objects retrieved:", arrayData);

        return snapshot.val(); // Return the retrieved data
      } else {
        console.log("No data available at this path.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Handle error accordingly
    }
  };
  console.log(userData);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      const exist = userData.filter((item) => {
        return item.password === id;
      });
      if (exist.length == 1) {
        nav("/userList");
        setOneUser(exist);
      }
      console.log(exist);
    } else {
      alert("userId do not exist");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit} action="">
        <label htmlFor="ID">Enter Unique ID</label>
        <input
          required
          type="text"
          name="ID"
          id="ID"
          placeholder="Enter Unique ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
