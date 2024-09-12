import { useEffect, useRef, useState } from "react";
import AttendeeCard from "./AttendeeCard";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { PiPushPinFill } from "react-icons/pi";
import { PiPushPinSlashFill } from "react-icons/pi";
import NoVideo from "./NoVideo";

const AttendeeState = ({ id, name, peer, width, microOn, videoOn, pinned, setPinned }: { id: string, name: string, peer: any, width?: number, microOn?: boolean, videoOn?: boolean, pinned: any, setPinned: any }) => {

    const ref = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        // peer.on("stream", (stream: any) => {
        //     console.log("stream", name, stream)
        //     if (ref.current) {
        //         ref.current.srcObject = stream;
        //     }
        // })

        return () => {
            if (ref.current) {
                const currentStream = ref.current.srcObject as MediaStream;
                if (currentStream) {
                    const tracks = currentStream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, [peer]);

    return (<div className="relative h-full w-full" id={`card-${id}`}>
        <div className="rounded-xl bg-gray-400 shadow-md shadow-gray-800 h-full w-full">
            <video className="rounded-xl max-h-96n h-full w-full" ref={ref} autoPlay playsInline hidden={!videoOn} id={id}></video>
            {!videoOn && <NoVideo name={name} />}
        </div>
        <div className="absolute w-full h-8 bottom-0 left-0 rounded rounded-t-sm rounded-xl m-0 bg-white opacity-30">
        </div>
        <div className="absolute bottom-0 left-0 m-1 w-full flex">
            <span className='text-black mr-auto  text-teal-900 opacity-100 mx-2'>{name}</span>

            <button className="mx-3 text-blue-500">{microOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}</button >
            <button className="mr-5 text-blue-500" onClick={() => setPinned(pinned === id?undefined:id)}>{pinned === id ? <PiPushPinFill size={18} /> : <PiPushPinSlashFill size={18} />}</button >
        </div>

    </div>)
}

export default AttendeeState