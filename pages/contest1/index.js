import Image from "next/image";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import {db} from '../../firebase'
import { useRouter } from "next/router";
var getYouTubeID = require('get-youtube-id');
// import { googleFormsToJson } from 'react-google-forms-hooks'


export default function Contest1() {

  const [formData, setFormData] = useState({
    dayNumber: '',
    date: '',
    formLink: '',
    videoLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleLink = (e) => {
    setFormData({...formData, videoLink: getYouTubeID(e.target.value)})
    console.log(getYouTubeID(e.target.value));
    
  }

  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parts = formData.formLink.split("?");
      const baseUrl = parts[0];
      const newUrl = `${baseUrl}?embed=true`;
      setFormData({...formData, formLink: newUrl});
      console.log(formData);
      const contestRef = collection(db, 'Contest1');
      const docRef = await addDoc(contestRef, {
        ['contestDetails']: {
          contestDay: formData.dayNumber,
          date: formData.date,
          formLink: newUrl,
          video: formData.videoLink,
        }
      });
      console.log('Document written with ID: ', docRef.id);
      // Reset form after successful submission
      setFormData({
        dayNumber: '',
        date: '',
        formLink: '',
        videoLink: '',
        
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };


//   const result = await googleFormsToJson(
//   'https://docs.google.com/forms/d/e/1FAIpQLSe5U3qvg8WHs4nkU-e6h2RlAD7fKoCkou6HO2w2-tXYIA_F8g/viewform'
// )

// console.log(result.fields)

  return (

    <div className="flex flex-col items-center">

    <button className=" ml-15 mt-10 bg-blue-800 text-white text-md w-[145px] h-[45px] rounded-md" onClick={handleBack}>← Go Back</button>

 

    <div className="flex flex-col justify-center items-center w-[60vw] mx-auto my-5 border-2 border-[#222222] p-10">
    <h1 className="text-bold text-black my-5">Please don&#39;t enter the shortened url. add the long url. The shortened url for google form doesn&#39;t get integrated in android devices</h1>
      <h1 className="my-5">Create Contest</h1>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
        <label>Day Number:</label>
        <input type="text" name="dayNumber" className="border-2 border-[#222222] my-6" value={formData.dayNumber} onChange={handleChange} />

        <label>Date:</label>
        <input type="date" name="date"  className="border-2 border-[#222222] my-6" value={formData.date} onChange={handleChange} />

        <label>FormLink:</label>
        <input type="text" name="formLink" className="border-2 border-[#222222] my-6" value={formData.formLink} onChange={handleChange} />

        <label>Youtube Video Link:</label>
        <input type="text" name="videoLink" className="border-2 border-[#222222] my-6" value={formData.videoLink} onChange={handleLink} />


        <button type="submit" className="w-[140px] h-[45px] bg-green-900 text-white">Submit</button>
      </form>
    </div>

    </div>
  );
}
