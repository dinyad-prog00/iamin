import { useEffect, useRef } from "react";
import { FaRegCopy } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
import { PiCopy } from "react-icons/pi";

const RoomSetup = ({ userVideo, joinRoom, name, setName, joined, roomID }: { userVideo: any, joinRoom: any, name: string, setName: any, joined: boolean, roomID: string }) => {
    const ref = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = userVideo;
        }
    }, [userVideo])

    const handleCopy = (e: any) => {
        e.preventDefault()
        //const url = location.href
        navigator.clipboard.writeText(`http://localhost:3000/r/${roomID}`)
    }

    return (


        <div className={`w-full items-center ${joined ? "hidden" : "flex flex-col"}`}>
            <div className="flex flex-col lg:w-3/4 items-center lg:flex-row">
                <div className="w-1/2 max-h-96 rounded-xl bg-gray-400 shadow-md shadow-gray-800 ">
                    <video className="rounded-xl max-h-96 h-full w-full" ref={ref} autoPlay playsInline></video>
                </div>
                <div className="w-1/2 mx-20 mt-10 lg:mt-0">
                    <h5 className="mb-2 text-4xl flex font-bold tracking-tight items-center text-white  dark:text-white">
                        <span className="block">Iamin</span>
                        <span className="block pl-4">|</span>
                        <span className="text-2xl block px-4"> {roomID}</span>
                        <span onClick={handleCopy} className="cursor-pointer block inline text-sm text-white ml-5 mb-2">
                            <FaRegCopy size={20} className="inline" />
                        </span></h5>
                    <p className="mb-3 text-lg font-normal text-white dark:text-gray-400 mb-10 block lg:w-3/4">Entrez votre nom complet pour participer. C'est le nom que verront les autres participants!</p>
                    {/* <label className="block mb-2 text-md font-medium text-white dark:text-white mt-5">Votre nom complet</label> */}
                    <div className="flex my-5">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900  bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                            <svg className="w-4 h-4 text-teal-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        </span>
                        <input onChange={(e) => setName(e.target.value)} type="text" className="rounded-none rounded-e-lg bg-gray-50  border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Sam Biche" />
                    </div>
                    <button onClick={joinRoom} type="button" className="block w-full text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Participer</button>

                </div>
            </div>
        </div>


    )
}

export default RoomSetup