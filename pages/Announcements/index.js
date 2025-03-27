import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/router";

const Results = () => {
  const router = useRouter();
  const [links, setLinks] = useState({
    result1: '',
    result2: '',
    result3: '',
    result4: '',
    result5: '',
    result6: '',
    result7: '',
    result8: ''
  });

  // Load data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'Announcements', 'announcements');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data().announcementDetails || {};
        setLinks({
          result1: data.result1 || '',
          result2: data.result2 || '',
          result3: data.result3 || '',
          result4: data.result4 || '',
          result5: data.result5 || '',
          result6: data.result6 || '',
          result7: data.result7 || '',
          result8: data.result8 || ''
        });
      }
    };

    fetchData();
  }, []);

  const updateLink = async (key, value) => {
    const docRef = doc(db, 'Announcements', 'announcements');
    try {
      await updateDoc(docRef, {
        [`announcementDetails.${key}`]: value
      });
      toast.success(`${key} updated successfully!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    if (links[key]) {
      await updateLink(key, links[key]);
    } else {
      toast.warning(`Please enter a URL for ${key}`);
    }
  };

  const handleDelete = async (key) => {
    await updateLink(key, '');
    setLinks(prev => ({ ...prev, [key]: '' }));
    toast.success(`${key} cleared!`);
  };

  // Extract YouTube ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <ToastContainer />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manage Results Videos</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ← Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(links).map(([key, url]) => (
            <div key={key} className="border rounded-lg p-4 shadow">
              <div className="mb-3">
                <label className="block font-medium mb-1">
                  {key.replace('result', 'Result ')} URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleInputChange(e, key)}
                  placeholder="https://youtube.com/..."
                  className="w-full border p-2 rounded"
                />
              </div>
              
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleSave(key)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(key)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              
              {url && (
                <div className="mt-2">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(url)}`}
                      className="w-full h-40"
                      title={key}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;