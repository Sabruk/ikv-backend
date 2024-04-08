import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import getYouTubeID from 'get-youtube-id';

const Announcements = () => {
  const [links, setLinks] = useState({
    link1: '',
    link2: '',
    link3: '',
    link4: '',
    link5: '',
    link6: '',
  });

  const updateLinkInFirebase = async (key, value) => {
    const docRef = doc(db, 'Announcements', 'announcements');
    await updateDoc(docRef, { [`announcementDetails.${key}`]: value });
  };

  const deleteLinkInFirebase = async (key) => {
    const docRef = doc(db, 'Announcements', 'announcements');
    await updateDoc(docRef, { [`announcementDetails.${key}`]: '' });
    setLinks((prevState) => ({...prevState, [key]: ""}))
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setLinks((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleAddLink = (key) => {
    const linkValue = links[key];
    if (linkValue) {
      updateLinkInFirebase(key, getYouTubeID(linkValue));
    }
  };

  const handleDeleteLink = (key) => {
    deleteLinkInFirebase(key);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col justify-center items-center gap-8">
        {Object.entries(links).map(([key, value]) => (
          <div key={key}>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(e, key)}
              placeholder={`Enter YouTube Link ${key.slice(-1)}`}
              className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => handleAddLink(key)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Link {key.slice(-1)}
            </button>
            <button
              onClick={() => handleDeleteLink(key)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
            >
              Delete Link {key.slice(-1)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
