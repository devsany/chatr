import React, { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import app from "../firebase/firestore";
import { useNavigate } from "react-router-dom";

const avatars = [
  {
    img: "https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Leo",
  },
  {
    img: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Eli",
  },
  {
    img: "https://img.freepik.com/premium-vector/smiling-girl-character_146237-61.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybridg",
    name: "Max",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Aya",
  },
  {
    img: "https://img.freepik.com/free-vector/young-man-black-shirt_1308-173618.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Sam",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869145.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ben",
  },
  {
    img: "https://img.freepik.com/premium-vector/avatar-man-with-beard-office-worker-wearing-glasses-it-developer-engineer-programmer_277909-144.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ivy",
  },
  {
    img: "https://img.freepik.com/premium-vector/young-man-face-avater-vector-illustration-design_968209-13.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Nia",
  },
  {
    img: "https://img.freepik.com/premium-vector/young-gamer-girl-avatar-streaming-with-colored-hair-gaming-headset_704771-3536.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Kai",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ray",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436189.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Bot",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Neo",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869123.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Lex",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Zed",
  },
  {
    img: "https://img.freepik.com/premium-photo/photo-3d-call-center-operator-with-headphones-generative-ai_742418-4932.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ada",
  },
  {
    img: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Eva",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869149.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ana",
  },
  {
    img: "https://img.freepik.com/premium-vector/avatar-man-with-glasses-portrait-young-guy-vector-illustration-face_217290-1809.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Mia",
  },
  {
    img: "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303087.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Lia",
  },
  {
    img: "https://img.freepik.com/premium-vector/man-profile-cartoon_18591-58483.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Zoe",
  },
  {
    img: "https://img.freepik.com/premium-vector/art-illustration_684058-1736.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Ian",
  },
  {
    img: "https://img.freepik.com/premium-vector/art-illustration_684058-982.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Joe",
  },
  {
    img: "https://img.freepik.com/premium-vector/boy-character-white-background_995281-5601.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Amy",
  },
  {
    img: "https://img.freepik.com/premium-photo/photo-happy-3d-female-it-technical-support-officer-generative-ai_742418-4960.jpg?ga=GA1.1.531472918.1726312312&semt=ais_hybrid",
    name: "Roy",
  },
];

const Registration = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [uniqueID, setUniqueID] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [password, setPassword] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [selectAccountStatus, setSelectAccountStatus] = useState("");
  const avatarsPerPage = 5;
  //unique name username generater
  function generateFunnyUsername() {
    const adjectives = [
      "Silly",
      "Cheeky",
      "Fluffy",
      "Goofy",
      "Spunky",
      "Wacky",
      "Quirky",
      "Bouncy",
      "Nifty",
      "Zany",
      "Wobbly",
      "Witty",
      "Snoopy",
      "Bizarre",
      "Jolly",
      "Funky",
      "Mischievous",
      "Jumpy",
      "Sassy",
      "Jumpy",
      "Smelly",
      "Clumsy",
      "Bubbly",
      "Snappy",
      "Feisty",
      "Giddy",
      "Lively",
      "Perky",
      "Breezy",
      "Mellow",
      "Twitchy",
      "Scruffy",
      "Snoozy",
      "Dizzy",
      "Dandy",
      "Peppy",
      "Mighty",
      "Freaky",
      "Nutty",
      "Sparky",
      "Jolly",
      "Wiggly",
      "Blissful",
      "Silly",
      "Goofy",
      "Zesty",
      "Spicy",
      "Crazy",
      "Kooky",
      "Breezy",
      "Snazzy",
      "Zippy",
      "Swooshy",
      "Feathery",
      "Toasty",
      "Slick",
      "Hyper",
      "Breezy",
      "Mysterious",
      "Silly",
      "Playful",
      "Vibrant",
      "Fluffy",
      "Jumpy",
      "Loud",
      "Bouncy",
      "Energetic",
      "Laughing",
      "Charming",
      "Jumpy",
      "Swooshy",
      "Lumpy",
      "Rowdy",
      "Whacky",
      "Sassy",
      "Sizzling",
      "Wiggly",
      "Jiggly",
      "Squishy",
      "Glowing",
      "Shiny",
      "Shimmering",
      "Dizzy",
      "Shaky",
      "Spontaneous",
      "Breezy",
      "Naughty",
      "Stinky",
      "Cranky",
      "Cuddly",
      "Wiggly",
      "Prankster",
      "Snoozy",
      "Giggly",
      "Zesty",
      "Hyperactive",
      "Lazy",
      "Funky",
      "Sassy",
      "Goofy",
      "Cuddly",
      "Bouncy",
      "Snappy",
      "Chipper",
      "Jumpy",
      "Grumpy",
      "Sparkly",
      "Fluffy",
      "Feisty",
    ];

    const nouns = [
      "Penguin",
      "Monkey",
      "Muffin",
      "Waffle",
      "Pineapple",
      "Panda",
      "Cactus",
      "Platypus",
      "Narwhal",
      "Cupcake",
      "Banana",
      "Unicorn",
      "Toaster",
      "Cabbage",
      "Froggy",
      "Llama",
      "Pickle",
      "Lobster",
      "Puppy",
      "Kitten",
      "Pineapple",
      "Donut",
      "Watermelon",
      "Cucumber",
      "Taco",
      "Butterfly",
      "Burrito",
      "Spaghetti",
      "Kangaroo",
      "Koala",
      "Squid",
      "Dolphin",
      "Starfish",
      "Mushroom",
      "Avocado",
      "Peanut",
      "Cupcake",
      "Bagel",
      "Cheese",
      "Mango",
      "Fuzzball",
      "Cucumber",
      "Tiger",
      "Snail",
      "Tomato",
      "Raccoon",
      "Giraffe",
      "Shark",
      "Octopus",
      "Poodle",
      "Sloth",
      "Lion",
      "Pillow",
      "Pinecone",
      "Carrot",
      "Potato",
      "Lobster",
      "Zebra",
      "Cabbage",
      "Pineapple",
      "Bear",
      "Pufferfish",
      "Penguin",
      "Banana",
      "Cherry",
      "Plum",
      "Coconut",
      "Carrot",
      "Taco",
      "Potato",
      "Mango",
      "Orange",
      "Butterfly",
      "Lettuce",
      "Panda",
      "Chicken",
      "Owl",
      "Giraffe",
      "Whale",
      "Beetle",
      "Rabbit",
      "Kangaroo",
      "Puppy",
      "Frog",
      "Shark",
      "Platypus",
      "Snail",
      "Zebra",
      "Koala",
      "Dragonfly",
      "Cabbage",
      "Fishtank",
      "Zucchini",
      "Penguin",
      "Snail",
      "Parrot",
      "Unicorn",
      "Pumpkin",
      "Whale",
      "Chili",
      "Monkey",
      "Chihuahua",
      "Toad",
      "Penguin",
      "Tortoise",
      "Potato",
      "Dragon",
      "Cactus",
      "Lizard",
      "Squash",
      "Lemon",
      "Garlic",
      "Tomato",
      "Octopus",
      "Raven",
      "Cucumber",
      "Pineapple",
      "Squirrel",
      "Avocado",
      "Eagle",
      "Fish",
      "Fungus",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    // Generate a random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    return `${randomAdjective}${randomNoun}-${randomNumber}`;
  }
  const nav = useNavigate();
  // Example usage
  // console.log(generateFunnyUsername()); // Example output: "SillyPenguin-54321"

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  function generate8CharString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase(app);
    const newDocm = push(ref(db, "users"));
    set(newDocm, {
      name,
      age,
      mobileNumber,
      uniqueID: generateUUID(),
      password,
      uniqueName: generateFunnyUsername(),
      avatar: selectedAvatar,
      avatarName: avatarName,
      selectAccountStatus,
    })
      .then(() => {
        setName("");
        setAge("");
        setMobileNumber("");
        setUniqueID("");
        setPassword("");
        setSelectedAvatar("");
        setSelectAccountStatus("");
        alert("Data Saved successfully");
        nav("/login");
      })
      .catch((err) => console.error("Error:", err.message));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => setIsCopied(true));
  };

  const handleAvatarSelect = (avatar, name) => {
    setSelectedAvatar(avatar);
    setAvatarName(name);
  };

  const indexOfLastAvatar = currentPage * avatarsPerPage;
  const indexOfFirstAvatar = indexOfLastAvatar - avatarsPerPage;
  const currentAvatars = avatars.slice(indexOfFirstAvatar, indexOfLastAvatar);

  const nextPage = () => {
    if (currentPage < Math.ceil(avatars.length / avatarsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
          User Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="age"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your age"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your mobile number"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="mobileNumber"
            >
              Select status
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="status"
              id="status"
              onChange={(e) => setSelectAccountStatus(e.target.value)}
            >
              <option
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                selected
              >
                Choose account Status
              </option>
              <option value="makePrivantAccount">Private</option>
              <option value="makePublicAccount">Public</option>
            </select>
          </div>
          <div>
            <h2 className="text-gray-700 font-semibold mb-2">
              Generated Password
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPassword(generate8CharString())}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              >
                Generate Password
              </button>
              {password && (
                <div className="flex items-center gap-2">
                  <p className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                    {password}
                  </p>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="text-sm text-indigo-600 underline"
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-gray-700 font-semibold mb-4">
              Select an Avatar
            </h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {currentAvatars.map((avatar, index) => {
                return (
                  <>
                    <div className="block">
                      <div>
                        <img
                          key={index}
                          src={avatar.img}
                          alt={`Avatar ${index + 1}`}
                          className={`w-20 h-20 rounded-full border-4 ${
                            selectedAvatar === avatar
                              ? "border-indigo-500"
                              : "border-gray-300"
                          } cursor-pointer`}
                          onClick={() =>
                            handleAvatarSelect(avatar.img, avatar.name)
                          }
                        />
                      </div>
                      <div className="text-center font-semibold text-gray-700">
                        {avatar.name}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            <div className="flex justify-center mt-4 gap-4">
              <button
                type="button"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(avatars.length / avatarsPerPage)
                }
                className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-300"
              >
                Next
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
