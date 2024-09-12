import React from "react";
import { useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { uid } from "uid"
const roomID = () => {

    let id1 = uid(6)
    let id2 = uid(6)
    for (let i = 0; i < 100; i++) {
        id1 = uid(6)
    }
    for (let i = 0; i < 50; i++) {
        id2 = uid(4)
    }

    return `${id1}-${uid(2)}-${id2}`

}
const CreateRoom = (props) => {
    const navigation = useNavigate()
    const create = async () => {
        //const id = uuid();
        //const id = `${uid(6)}-${uid(2)}-${uid(4)}`
        const id = roomID()
        navigation(`/r/${id}`)
    }

    return (
        <div className="h-screen w-full flex items-center bg-gradient-to-b from-slate-950  to-gray-950">
            <div className="w-full flex flex-col items-center">
                <div className="w-5/6 md:w-1/2  xl:w-1/4 flex flex-col items-center">
                    <button onClick={create} type="button" className="block w-full text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create room</button>
                    {/* <hr className="text-white w-5/6 my-5 "/> */}
                    <button onClick={create} type="button" className="block w-full mt-5 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Join room</button>

                </div>
            </div>

        </div>

    );
};

export default CreateRoom;
