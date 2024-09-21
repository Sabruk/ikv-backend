import React, { useState } from 'react';
import { db } from '../../firebase'; // Removed storage since we are using image URLs
import { collection, updateDoc, doc } from 'firebase/firestore';
import getYouTubeID from 'get-youtube-id';

const Announcements = () => {
  const [data, setData] = useState({
    link1: '',
    link2: '',
    link3: '',
    link4: '',
    link5: '',
    link6: '',
    title: '',
    content: '',
    image: '', // Store the image URL here
  });

  // Update any field in Firestore
  const updateFieldInFirebase = async (key, value) => {
    const docRef = doc(db, 'Announcements', 'announcements');
    await updateDoc(docRef, { [`announcementDetails.${key}`]: value });
  };

  const deleteFieldInFirebase = async (key) => {
    const docRef = doc(db, 'Announcements', 'announcements');
    await updateDoc(docRef, { [`announcementDetails.${key}`]: '' });
    setData((prevState) => ({ ...prevState, [key]: '' }));
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleAddField = async (key) => {
    const value = data[key];
    if (value) {
      if (key.startsWith('link')) {
        updateFieldInFirebase(key, getYouTubeID(value));
      } else {
        updateFieldInFirebase(key, value);
      }
    }
  };

  const handleDeleteField = (key) => {
    deleteFieldInFirebase(key);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col justify-center items-center gap-8">
        {/* YouTube Links */}
        {Object.entries(data).map(([key, value]) => {
          if (key.startsWith('link')) {
            return (
              <div key={key}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(e, key)}
                  placeholder={`Enter YouTube Link ${key.slice(-1)}`}
                  className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                  onClick={() => handleAddField(key)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Add Link {key.slice(-1)}
                </button>
                <button
                  onClick={() => handleDeleteField(key)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
                >
                  Delete Link {key.slice(-1)}
                </button>
              </div>
            );
          }
          return null;
        })}

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleInputChange(e, 'title')}
            placeholder="Enter Announcement Title"
            className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => handleAddField('title')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Title
          </button>
          <button
            onClick={() => handleDeleteField('title')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
          >
            Delete Title
          </button>
        </div>

        {/* Image URL Input */}
        <div>
          <input
            type="text"
            value={data.image}
            onChange={(e) => handleInputChange(e, 'image')}
            placeholder="Enter Image URL"
            className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => handleAddField('image')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Image
          </button>
          <button
            onClick={() => handleDeleteField('image')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
          >
            Delete Image
          </button>
          {data.image && <img src={data.image} alt="Uploaded" className="mt-4 w-64" />}
        </div>

        {/* Content Input */}
        <div>
          <textarea
            value={data.content}
            onChange={(e) => handleInputChange(e, 'content')}
            placeholder="Enter Content or Description"
            className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300 w-full h-24"
          />
          <button
            onClick={() => handleAddField('content')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Content
          </button>
          <button
            onClick={() => handleDeleteField('content')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
          >
            Delete Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
