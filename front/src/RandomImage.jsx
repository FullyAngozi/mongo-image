import { useState } from "react";

const RandomImageDisplay = () => {
  const [randomImage, setRandomImage] = useState(null);
  const [error, setError] = useState(null);
  const [imageKey, setImageKey] = useState(0); // Added key state

  const fetchRandomImage = async () => {
    try {
      const response = await fetch("https://mongo-imageuploader.onrender.com/randomImage");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRandomImage(data);
      setError(null);
      setImageKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    } catch (error) {
      console.error("Error fetching random image:", error);
      setError("Error fetching random image. Please try again.");
    }
  };

  return (
    <div className="mt-10">
      <button
        className="py-2 px-4 rounded-full hover:bg-red-900 bg-red-500 text-white"
        onClick={fetchRandomImage}
      >
        Get Image from Db
      </button>
      <div className="bg-gray-700 min-h-[400px] max-w-[400px] block mt-3">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : randomImage ? (
          <>
            {console.log('Image URL:', `https://mongo-imageuploader.onrender.com/images/${randomImage.name}`)}
            <img
              key={imageKey} // Add a key to force re-render
              src={`http://localhost:3000/images/${randomImage.name}`}
              alt=""
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RandomImageDisplay;
