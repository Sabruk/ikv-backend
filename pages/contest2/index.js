import Image from "next/image";
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import {db} from '../../firebase'
import { useRouter } from "next/router";


const Contest2 =() => {
  const [isEnabled, setIsEnabled] = useState(false);

  const [formData, setFormData] = useState({
    dayNumber: '',
    date: '',
    formLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parts = formData.formLink.split("?");
      const baseUrl = parts[0];
      const newUrl = `${baseUrl}?embed=true`;
      setFormData({...formData, formLink: newUrl});
      const contestRef = collection(db, 'Contest2');
      const docRef = await addDoc(contestRef, {
        ['contestDetails']: {
          contestDay: formData.dayNumber,
          date: formData.date,
          formLink: newUrl,
        }
      });
      console.log('Document written with ID: ', docRef.id);
      // Reset form after successful submission
      setFormData({
        dayNumber: '',
        date: '',
        formLink: '',
        
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  }


  return (

    <>
    {
        isEnabled ? (
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
      
              <button type="submit" className="w-[140px] h-[45px] bg-green-900 text-white">Submit</button>
              <button className="w-[130px] h-[45px] rounded-md bg-[#2dad5c] text-white" onClick={() => setIsEnabled(false)}>Disable</button>
            </form>
          </div>
      
          </div>
        ) : 
        (
          <div className="flex flex-col h-[100vh] justify-center items-center">

        <h1 className="font-bold">Contest has been ended. Click below to enable the contest</h1>
        <button className="w-[130px] h-[45px] rounded-md bg-[#2dad5c] text-white" onClick={() => setIsEnabled(true)}>Enable</button>

      </div>
        )
    }

   

    </>
  );
}

export default Contest2;