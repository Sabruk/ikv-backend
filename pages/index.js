import React from "react";
import { useRouter } from "next/router";

const Home = () => {

  const router = useRouter();

  const route = async (cid) => {
    await router.push(`/${cid}`);
  }

  return (
    <div className="flex flex-col gap-16 justify-center items-center h-[100vh]">

      <h1 className="text-center w-[80vw] text-lg text-bold">Click below buttons to enter the respective contest details into Database</h1>

      <button className="w-[145px] h-[45px] bg-green-700 text-white mx-5" onClick={() => route('contest1')}>Contest1</button>
      <button className="w-[145px] h-[45px] bg-green-700 text-white" onClick={() => route('contest2')}>Contest2</button>

    </div>
  )
}

export default Home;