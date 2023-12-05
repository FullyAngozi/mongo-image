import  { useState } from 'react';
import axios from 'axios';
import RandomImageDisplay from './RandomImage';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);

      // Clear the selected file after successful upload
      setSelectedFile(null);

      // Show an alert or message
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="p-6 flex justify-between items-center border rounded-2xl">
        <input type="file" name="image" onChange={handleFileChange} className="bg-orange-600 p-6 rounded-full" />
        <button
          onClick={handleUpload}
          className="bg-black text-white px-4 py-3 rounded-3xl shadow-gray-700 shadow-md"
        >
          Upload image
        </button>
      </div>
      {uploadSuccess !== null && <p className=' text-white border border-white rounded-full py-4 px-8  max-w-[3 mt-3 font-bold '>{uploadSuccess ? 'Image uploaded successfully!' : 'Failed to upload image.'}</p>}
      <RandomImageDisplay key={uploadSuccess} />
    </div>
  );
};

export default ImageUpload;
