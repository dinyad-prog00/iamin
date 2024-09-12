import { forwardRef, useState } from "react"
import AttendeeCard from "./AttendeeCard"
import AttendeeState from "./AttendeeState"
import { Message, PeerData } from "../types"
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa"
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md"
import { BsChatLeftTextFill } from "react-icons/bs"
import { IoIosPeople } from "react-icons/io"
import MessagesList from "./MessagesList"
import AttendeesNameList from "./AttendeesNameList"


const col = (size: number) => {
    if (1 <= size && size <= 3) {
        return size.toString()

    }
    if (size == 4 || size === 6 || size === 8) return (size / 2).toString()

    return "4"

}

const AttendeesList = ({ curid,peers, userVideoSrc, userScreenSrc, cardWidth, ngrid, name, shareScreen, sharing, pinned, setPinned, messages, send,chatOn,setChatOn,attendeesOn,setAttendeesOn }: { curid:string,peers: PeerData[], userVideoSrc: any, userScreenSrc: any, cardWidth: number, ngrid: number, name: string, shareScreen: any, sharing: boolean, pinned: any, setPinned: any, messages: Message[], send: any ,chatOn:boolean,setChatOn:any,attendeesOn:boolean,setAttendeesOn:any}) => {

    const [microOn, setMicroOn] = useState(true)
    const [videoOn, setVideoOn] = useState(true)
    //const [chatOn, setChatOn] = useState(false)
    //const [attendeesOn, setAttendeesOn] = useState(false)
    //grid  gap-4 grid-cols-${ngrid} 
    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex w-full h-[94%]">
                <div className="grow">

                    {pinned && <div className="w-full h-[94%]  flex">



                        <div className="basis-9/12 h-full p-8">
                            {
                                pinned === "0" ? <AttendeeCard pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous)`} srcObject={userVideoSrc} videoOn={videoOn} microOn={microOn} />
                                    : pinned === "1" ? <AttendeeCard screen pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous partage)`} srcObject={userScreenSrc} videoOn={videoOn} microOn={microOn} />
                                        : peers.filter((it) => it.user.id === pinned).map((peerData) => <AttendeeState key={peerData.user.id} id={peerData.user.id} pinned={pinned} setPinned={setPinned} peer={peerData.peer} name={peerData.user.name} videoOn />)
                            }
                        </div>


                        <div className="basis-3/12 h-full overflow-y-scroll pr-2 my-5">
                            <div className={`w-full  h-content flex justify-center flex-wrap items-center`}>
                                {pinned !== "0" && <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2">
                                    <AttendeeCard pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous)`} srcObject={userVideoSrc} videoOn={videoOn} microOn={microOn} />
                                </div>}
                                {pinned !== "1" && sharing && <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2">
                                    <AttendeeCard screen pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous partage)`} srcObject={userScreenSrc} videoOn={videoOn} microOn={microOn} />
                                </div>}
                                {
                                    peers.filter((it) => !it.hidden && it.user.id !== pinned).map((peerData) => <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2" key={peerData.user.id} ><AttendeeState id={peerData.user.id} pinned={pinned} setPinned={setPinned} peer={peerData.peer} name={peerData.user.name} videoOn /></div>)
                                }

                            </div>
                        </div>

                    </div>}
                    {!pinned && <div className={`w-full h-full  grow flex justify-center flex-wrap items-center overflow-y-scroll`}>
                        <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2">
                            <AttendeeCard pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous)`} srcObject={userVideoSrc} videoOn={videoOn} microOn={microOn} />
                        </div>
                        {sharing && <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2">
                            <AttendeeCard screen pinned={pinned} setPinned={setPinned} key={0} name={`${name} (vous partage)`} srcObject={userScreenSrc} videoOn={videoOn} microOn={microOn} />
                        </div>}
                        {
                            peers.filter((it) => !it.hidden).map((peerData) => <div style={{ width: cardWidth, height: cardWidth - cardWidth * 0.4 }} className="m-2" key={peerData.user.id} ><AttendeeState id={peerData.user.id} pinned={pinned} setPinned={setPinned} peer={peerData.peer} name={peerData.user.name} videoOn /></div>)
                        }

                    </div>}
                </div>

                {chatOn &&  !attendeesOn &&  <div className="basis-3/12 h-full p-5 bg-slate-900">
                    <MessagesList messages={messages} send={send} peers={peers}  curid={curid}/>
                </div>}
                { attendeesOn && !chatOn && <div className="basis-3/12 h-full p-5 bg-slate-900">
                    <AttendeesNameList messages={messages} send={send} peers={peers}  curid={curid}/>
                </div>}
            </div>
            <div className=" w-full h-[6%] bottom-0 left-0 rounded rounded-t-sm rounded-lg m-0 bg-gray-200 opacity-100 flex flex-col justify-center items-center">
                <div className="flex">
                    <button onClick={() => setMicroOn(!microOn)} className="mx-5 text-teal-500">{microOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}</button >
                    <button onClick={() => setVideoOn(!videoOn)} className="mx-5 text-teal-500"> {videoOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}</button >
                    <button onClick={shareScreen} className="mx-5 text-teal-500"> {!sharing ? <MdOutlineScreenShare size={25} /> : <MdOutlineStopScreenShare size={25} />}</button >
                    <button onClick={() => {setChatOn(!chatOn);setAttendeesOn(false)}} className="mx-5 text-teal-500"> {chatOn?<BsChatLeftTextFill size={19} className="text-teal-800" />:<BsChatLeftTextFill size={19} />}</button >
                    <button onClick={() => {setAttendeesOn(!attendeesOn);setChatOn(false)}} className="mx-5 text-teal-500 relative"> {attendeesOn?<IoIosPeople size={30} className="text-teal-800"/>:<IoIosPeople size={30} />} <span className="absolute block bg-blue-700 text-white rounded-full p-1 px-2  text-xs -top-2 -right-2">{peers.length+1}</span></button >
                </div>
            </div>

        </div>
    )
}

export default AttendeesList