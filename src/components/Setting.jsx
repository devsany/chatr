import React, { useState, useEffect } from "react";

import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { get, getDatabase, ref, update } from "firebase/database";
import app, { db } from "../firebase/firestore";

function Setting({ userID }) {
  const [settings, setSettings] = useState({
    darkMode: false,
    theme: "Default",
    fontFamily: "Arial",
    name: "",
    age: "",
    avatar: "",
    mobileNumber: "",
    password: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  const fetchUserData = async () => {
    const db = getDatabase(app);                
    const userRef = ref(db, `users/${userID}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setSettings(snapshot.val());
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async (key, value) => {
    const db = getDatabase(app);
    const userRef = ref(db, `users/${userID}`);
    await update(userRef, { [key]: value });
    alert("Changes saved successfully!");
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    handleSave("theme", newTheme);
  };

  const handleFontFamilyChange = (e) => {
    const newFont = e.target.value;
    setSettings((prev) => ({ ...prev, fontFamily: newFont }));
    handleSave("fontFamily", newFont);
  };

  return (
    <div
      className={`p-6 ${
        settings.darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Toggle Dark Mode */}
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) =>
              handleSave("darkMode", e.target.checked).then(() =>
                setSettings((prev) => ({ ...prev, darkMode: e.target.checked }))
              )
            }
          />
          Dark Mode
        </label>
      </div>

      {/* Theme Selector */}
      <div className="mb-4">
        <label>
          Theme:
          <select value={settings.theme} onChange={handleThemeChange}>
            <option value="Default">Default</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
          </select>
        </label>
      </div>

      {/* Font Family Selector */}
      <div className="mb-4">
        <label>
          Font Family:
          <select value={settings.fontFamily} onChange={handleFontFamilyChange}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
        </label>
      </div>

      {/* Editable Account Details */}
      <div className="mb-4">
        <label>Name:</label>
        <input
          type="text"
          value={settings.name}
          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          onBlur={() => handleSave("name", settings.name)}
        />
      </div>

      {/* Social Media Links */}
      <div className="mb-4">
        <h3>Social Links:</h3>
        <input
          type="text"
          placeholder="Facebook URL"
          value={settings.socialLinks.facebook}
          onChange={(e) =>
            setSettings({
              ...settings,
              socialLinks: {
                ...settings.socialLinks,
                facebook: e.target.value,
              },
            })
          }
          onBlur={() =>
            handleSave("socialLinks/facebook", settings.socialLinks.facebook)
          }
        />
        <input
          type="text"
          placeholder="Twitter URL"
          value={settings.socialLinks.twitter}
          onChange={(e) =>
            setSettings({
              ...settings,
              socialLinks: { ...settings.socialLinks, twitter: e.target.value },
            })
          }
          onBlur={() =>
            handleSave("socialLinks/twitter", settings.socialLinks.twitter)
          }
        />
        <input
          type="text"
          placeholder="Instagram URL"
          value={settings.socialLinks.instagram}
          onChange={(e) =>
            setSettings({
              ...settings,
              socialLinks: {
                ...settings.socialLinks,
                instagram: e.target.value,
              },
            })
          }
          onBlur={() =>
            handleSave("socialLinks/instagram", settings.socialLinks.instagram)
          }
        />
      </div>

      {/* Share Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            const shareText = `Check out my site at https://your-site-url.com!`;
            navigator.share
              ? navigator.share({ text: shareText })
              : alert(shareText);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Share
        </button>
      </div>
    </div>
  );
}

export default Setting;
