import { useState } from "react"
import { Message, PeerData } from "../types"

import { BsSend, BsSendX } from "react-icons/bs"
const AttendeesNameList = ({curid, messages, send, peers }: {curid:string, messages: Message[], send: any, peers: PeerData[] }) => {
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
            Participants ({peers.length+1})
        </div>

        {/* body */}
        <div className="grow overflow-y-scroll">
            <div className="">
            <div className="border border-t-gray-300 px-4">Vous</div>
                {peers.map((it)=><div className="border border-t-gray-300 px-4">{it.user.name}</div>)}
            </div>
        </div>

        {/* footer */}
        <div className="px-4 py-3  border-t border-gray-300 border-r-lg flex shadow-md">
            
            </div>


    </div>
}

export default AttendeesNameList