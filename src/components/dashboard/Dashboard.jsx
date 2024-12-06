import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const nav = useNavigate();

  return (
    <div className="mt-10">
      <button onClick={nav("/userList")}>Back</button>
      <h2>Dashboard</h2>
      <p>Welcome to the protected dashboard!</p>
    </div>
  );
};

export default Dashboard;
