import React, { useState } from 'react';
import { db } from '../../firebase'; // Import the db from your firebase configuration
import { doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

const Results = () => {
  // Set the initial state for the form data with 8 video links
  const [data, setData] = useState({
    video1: '',
    video2: '',
    video3: '',
    video4: '',
    video5: '',
    video6: '',
    video7: '',
    video8: '',
  });

  const videoDetails = {
    1: {
      title: "ரமலான் தொடர் பயான் நிகழ்ச்சி - சரியான பதில்கள்",
      release: "Will be released on 28th March - 10:30PM",
    },
    2: {
      title: "ஓர் அழகிய உபதேசம் நிகழ்ச்சி - சரியான பதில்கள்",
      release: "Will be released on 29th March - 4:30AM",
    },
    3: {
      title: "தினம் ஒரு கேள்வி நிகழ்ச்சி - சரியான பதில்கள்",
      release: "Will be released on 29th March - 5:00PM",
    },
    4: {
      title: "ரமலான் தொடர் பயான் நிகழ்ச்சி - வெற்றியாளர்கள் பட்டியல்",
      release: "Will be released on 29th March - 10:30PM",
    },
    5: {
      title: "ஓர் அழகிய உபதேசம் நிகழ்ச்சி - வெற்றியாளர்கள் பட்டியல்",
      release: "Will be released on 30th March - 4:30AM",
    },
    6: {
      title: "Arabic Calligraphy Contest - Overall Participants Video",
      release: "Will be released on 30th March - 1:30PM",
    },
    7: {
      title: "தினம் ஒரு கேள்வி நிகழ்ச்சி - வெற்றியாளர்கள் பட்டியல்",
      release: "Will be released on 30th March - 5:00PM",
    },
    8: {
      title: "Arabic Calligraphy Contest - வெற்றியாளர்கள் பட்டியல்",
      release: "Will be released on 30th March - 10:30PM",
    }
  };

  // Update any field in Firestore
  const updateFieldInFirebase = async (key, value) => {
    const docRef = doc(db, 'Results', 'videos');
    await updateDoc(docRef, { [`videoLinks.${key}`]: value });
    toast.success(`${key} added successfully!`); // Show success toast when field is updated
  };

  // Handle form input changes and update state
  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setData((prevState) => ({ ...prevState, [key]: value }));
  };

  // Handle adding fields to Firestore
  const handleAddField = async (key) => {
    const value = data[key];
    if (value) {
      await updateFieldInFirebase(key, value);
    }
  };

  // Handle deleting fields from Firestore
  const handleDeleteField = async (key) => {
    const docRef = doc(db, 'Results', 'videos');
    await updateDoc(docRef, { [`videoLinks.${key}`]: '' });
    setData((prevState) => ({ ...prevState, [key]: '' }));
    toast.error(`${key} deleted successfully!`); // Show delete toast
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ToastContainer /> {/* ToastContainer added here */}

      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className="text-2xl font-bold mb-4">Manage Results Videos</h1>
        
        {/* Video Links */}
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(e, key)}
                placeholder={videoDetails[key.slice(-1)].title}
                className="border border-gray-300 px-3 py-1 rounded-lg focus:outline-none focus:ring focus:border-blue-300 flex-1"
              />
              <button
                onClick={() => handleAddField(key)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              >
                Add
              </button>
              <button
                onClick={() => handleDeleteField(key)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              >
                Delete
              </button>
            </div>
            {value && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Preview:</p>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${getYouTubeId(value)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to extract YouTube video ID from URL
function getYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default Results;
