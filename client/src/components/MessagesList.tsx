import { useState } from "react"
import { Message, PeerData } from "../types"

import { BsSend, BsSendX } from "react-icons/bs"
const MessagesList = ({curid, messages, send, peers }: {curid:string, messages: Message[], send: any, peers: PeerData[] }) => {
    const [m, setM] = useState("")
    const [peer, setPeer] = useState<any>(undefined)

    const handleChange = (v: string) => {
        console.log(v)
        if (v == "all") {
            setPeer(undefined)
        } else {
            setPeer(peers.find((it) => it.user.id === v))
        }
    }
    return <div className="h-full w-full flex flex-col bg-gray-200 rounded rounded-2xl">
        {/* header */}
        <div className="px-5 py-3 text-xl text-black border-b border-gray-300 shadow-sm border-r-lg">
            Discussion
        </div>

        {/* body */}
        <div className="grow p-5 overflow-y-scroll">
            <div className="">
                {messages.map((msg, i) => {
                    return <div className={`my-3 ${curid===msg.user.id?"text-right":""}`} key={`${msg.user.id}-${i}`}>
                        { ((i===0) || (msg.user.id!==messages[i-1].user.id)) && <span className="text-green-800 italic block px-1">{msg.user.name}</span>}
                        <span className={`${curid===msg.user.id?"bg-blue-700 rounded-r-xl rounded-l-3xl":"bg-teal-500 rounded-r-3xl rounded-l-xl"}  rounded px-3 bg-opacity-10 py-1`}>{msg.message} {msg.private ? "(privé)" : ""}</span></div>
                })}
            </div>
        </div>

        {/* footer */}
        <div className="px-4 py-3  border-t border-gray-300 border-r-lg flex shadow-md">
            <select onChange={(e) => handleChange(e.target.value)} className="">
                <option value="all">A tous</option>
                {peers.map((it, i) => <option value={it.user.id} key={i}>A {it.user.name}</option>)}
            </select>
            <input type="text" value={m} onChange={(e) => setM(e.target.value)} placeholder="Ton message..."
                className="grow mx-2 px-4 py-1 rounded rounded-3xl  " />
            {m.length !== 0 && <button onClick={() => { send(peer, m); setM("") }} className="bg-white rounded rounded-full p-2"><BsSend /></button>}
        </div>


    </div>
}

export default MessagesList