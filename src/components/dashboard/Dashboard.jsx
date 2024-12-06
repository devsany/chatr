import React, { useState, useContext } from "react";
import { AppContext } from "../context";
import { getDatabase, ref, get, update } from "firebase/database";

// Social Media icons
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Dialog } from "@mui/material";

const Dashboard = () => {
  const { oneUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    ...oneUser[0],
    selectAccountStatus: oneUser.selectAccountStatus || "makePrivantAccount",
    socialLinks: oneUser.socialLinks || {},
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [newPassword, setNewPassword] = useState(""); // State for new password input

  // Function to handle opening of the dialog
  const openChangePasswordDialog = () => {
    setOpenDialog(true);
    setNewPassword(""); // Clear input field when dialog opens
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialChange = (e, platform) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [platform]: value,
      },
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getDatabase();
      const usersRef = ref(db, "users");

      // Get the list of users from Firebase
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find(
          (key) => users[key].uniqueID === formData.uniqueID
        );

        if (userKey) {
          // Update the specific user's data
          const userRef = ref(db, `users/${userKey}`);
          await update(userRef, {
            name: formData.name,
            mobileNumber: formData.mobileNumber,
            age: formData.age,
            avatarName: formData.avatarName,
            avatar: formData.avatar,
            password: newPassword,
            selectAccountStatus: formData.selectAccountStatus,
            socialLinks: formData.socialLinks,
          });
          alert("User information updated successfully!");
        } else {
          alert("User not found!");
        }
      } else {
        alert("No users found in the database!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`container mx-auto p-6 max-w-xl ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold text-center mb-6">Edit User Details</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white shadow-md rounded-lg p-6 border"
      >
        {/* Unique ID (Disabled) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Unique ID
          </label>
          <input
            type="text"
            name="uniqueID"
            value={formData.uniqueID}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* ID (Disabled) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Mobile Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Avatar Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Avatar Name
          </label>
          <input
            type="text"
            name="avatarName"
            value={formData.avatarName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Avatar URL */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Avatar URL
          </label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Avatar Preview */}
        <div className="mb-4 text-center">
          <img
            src={formData.avatar}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full mx-auto border border-gray-300"
          />
        </div>

        {/* Account Status */}
        <div className="mb-4 col-span-2">
          {oneUser[0].selectAccountStatus === "makePrivantAccount" ? (
            <>
              <div className="flex">
                <div>
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                      clip-rule="evenodd"
                    />
                  </svg>{" "}
                </div>
                <div className="block  mt-[2px] ml-2 text-gray-700 font-medium mb-2">
                  Your account is Private
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex">
                <div>
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                      clip-rule="evenodd"
                    />
                  </svg>{" "}
                </div>
                <div className="block mt-[2px] ml-2 text-gray-700 font-medium mb-2">
                  Your account is Public
                </div>
              </div>
            </>
          )}

          <select
            name="selectAccountStatus"
            value={formData.selectAccountStatus}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="makePrivantAccount">Make Private Account</option>
            <option value="makePublicAccount">Make Public Account</option>
          </select>
        </div>
        <div>
          <div className="bg-white  w-[100%] p-6 rounded-lg shadow-md ">
            <p className="text-lg font-medium text-gray-700 mb-4">
              Your password:{" "}
              <span className="font-semibold text-gray-900">
                {newPassword.length > 0 ? newPassword : oneUser[0].password}
              </span>
            </p>
            <div
              onClick={openChangePasswordDialog}
              className="w-full flex justify-center items-center py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Change Password
            </div>
          </div>

          {/* Dialog Box for Changing Password */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <div style={{ padding: "20px" }}>
              {/* <h3 className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Change Your Password
              </h3> */}
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 mb-3 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <div>
                {/* <button onClick={handleChangePassword}>Change Password</button> */}
                <button
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setOpenDialog(false)}
                >
                  save
                </button>
              </div>
            </div>
          </Dialog>
        </div>
        {/* Social Media Links */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Social Media
          </label>

          {/* Facebook */}
          <div className="flex items-center mb-2">
            <FaFacebook className="mr-2 text-blue-600" />
            <input
              type="text"
              name="facebook"
              value={formData.socialLinks.facebook || ""}
              onChange={(e) => handleSocialChange(e, "facebook")}
              placeholder="Facebook URL"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Instagram */}
          <div className="flex items-center mb-2">
            <FaInstagram className="mr-2 text-pink-600" />
            <input
              type="text"
              name="instagram"
              value={formData.socialLinks.instagram || ""}
              onChange={(e) => handleSocialChange(e, "instagram")}
              placeholder="Instagram URL"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Twitter */}
          <div className="flex items-center mb-2">
            <FaTwitter className="mr-2 text-blue-400" />
            <input
              type="text"
              name="twitter"
              value={formData.socialLinks.twitter || ""}
              onChange={(e) => handleSocialChange(e, "twitter")}
              placeholder="Twitter URL"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Dark Mode
          </label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="w-6 h-6"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
