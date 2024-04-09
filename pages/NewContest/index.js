import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from "next/router";

const NewContest = () => {
    const [formData, setFormData] = useState({
        seriesNumber: '',
        sectionNumber: '',
        date: '',
        formLink: '',
    });
    const [contestList, setContestList] = useState([]);
    
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
            const contestRef = collection(db, 'WeeklyContest');
            const docRef = await addDoc(contestRef, {
                contestDetails: {
                    contestSeries: formData.seriesNumber,
                    seriesSection: formData.sectionNumber,
                    date: formData.date,
                    formLink: newUrl,
                }
            });
            console.log('Document written with ID: ', docRef.id);
            // Reset form after successful submission
            setFormData({
                seriesNumber: '',
                sectionNumber: '',
                date: '',
                formLink: '',
            });
            // Fetch updated contest list after adding a new entry
            fetchContestList();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const router = useRouter();

    const handleBack = () => {
        router.push("/");
    };

    const fetchContestList = async () => {
        const contestRef = collection(db, 'WeeklyContest');
        const snapshot = await getDocs(contestRef);
        const contests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContestList(contests);
    };

    useEffect(() => {
        fetchContestList();
    }, []);

    const handleDelete = async (contestId) => {
        try {
            await deleteDoc(doc(db, 'WeeklyContest', contestId));
            // Fetch updated contest list after deleting an entry
            fetchContestList();
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button className="ml-15 mt-10 bg-blue-800 text-white text-md w-[145px] h-[45px] rounded-md" onClick={handleBack}>← Go Back</button>
      
            <div className="flex flex-col justify-center items-center w-[60vw] mx-auto my-5 border-2 border-[#222222] p-10">
                <h1 className="text-bold text-black my-5">Please don&apos;t enter the shortened URL. Add the long URL. The shortened URL for Google Form doesn&apos;t get integrated on Android devices.</h1>
                <h1 className="my-5">Create Contest</h1>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                    <label>Series Number:</label>
                    <input type="text" name="seriesNumber" className="border-2 border-[#222222] my-6" value={formData.seriesNumber} onChange={handleChange} />
      
                    <label>Section Number:</label>
                    <input type="text" name="sectionNumber" className="border-2 border-[#222222] my-6" value={formData.sectionNumber} onChange={handleChange} />

                    <label>Date:</label>
                    <input type="date" name="date"  className="border-2 border-[#222222] my-6" value={formData.date} onChange={handleChange} />
      
                    <label>FormLink:</label>
                    <input type="text" name="formLink" className="border-2 border-[#222222] my-6" value={formData.formLink} onChange={handleChange} />
      
                    <button type="submit" className="w-[140px] h-[45px] bg-green-900 text-white">Submit</button>
                </form>
            </div>
      
            <div className="w-[60vw] mx-auto my-5 border-2 border-[#222222] p-10">
                <h2 className="text-xl font-semibold mb-3 text-[#2dad5c]">Contest Details</h2>
                <h2 className="text-xl font-semibold mb-3">Please don&apos;t worry if the form link you entered and the form link displayed below doesn&apos;t match, the link format is changed for the purpose of integration into the site. Use the below delete option if you had wrongly entered a form link or any other detail...</h2>
                <ul>
                    {contestList.map((contest) => (
                        <li key={contest.id} className="mb-5">
                            <p>Series Number: {contest.contestDetails.contestSeries}</p>
                            <p>Section Number: {contest.contestDetails.seriesSection}</p>
                            <p>Date: {contest.contestDetails.date}</p>
                            <p>Form Link: {contest.contestDetails.formLink}</p>
                            <button onClick={() => handleDelete(contest.id)} className="bg-red-500 text-white px-2 py-1 mt-2">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NewContest;
