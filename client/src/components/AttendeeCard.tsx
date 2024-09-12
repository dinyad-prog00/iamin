import { forwardRef, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { PiPushPinFill } from "react-icons/pi";
import { PiPushPinSlashFill } from "react-icons/pi";
import NoVideo from './NoVideo';
const AttendeeCard = ({ name, srcObject, microOn, videoOn, pinned, setPinned,screen }: { name: string, srcObject: any, microOn?: boolean, videoOn?: boolean, pinned: any, setPinned: any,screen?:boolean }) => {
    const ref = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = srcObject;
        }
    }, [srcObject])

    const spin = ()=>{
        if(screen){
            setPinned(pinned === "1" ? undefined : "1")
        }else{
            setPinned(pinned === "0" ? undefined : "0")
        }
    }
    return (
        <div className='h-full w-full relative '>
            <div className="rounded-xl bg-gray-400 shadow-md shadow-gray-800 h-full w-full ">
                {videoOn ? <video className="rounded-xl max-h-96n h-full w-full" ref={ref} autoPlay playsInline ></video> : <NoVideo name={name} />}
            </div>
            <div className="absolute w-full h-8 bottom-0 left-0 rounded rounded-t-sm rounded-xl m-0 bg-white opacity-30">
            </div>
            <div className="absolute bottom-0 left-0 m-1 w-full flex">
                <span className='text-black mr-auto  text-teal-900 opacity-100 mx-2'>{name}</span>
                <button className="mx-3 text-blue-500">{microOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}</button >
                <button className="mr-5 text-blue-500" onClick={spin}>{((!screen && pinned === "0") || (screen && pinned === "1")) ? <PiPushPinFill size={18} /> : <PiPushPinSlashFill size={18} />}</button >

            </div>

        </div>
    )
}

export default AttendeeCard