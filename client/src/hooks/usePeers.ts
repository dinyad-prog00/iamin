import { useEffect, useState } from "react";
import { Message, PeerData } from "../types";

const usePeers = () => {
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [cardWidth, setCardWidth] = useState(window.innerWidth - 400)
    const [sharing, setSharing] = useState(false)
    const [ngrid, setNgrid] = useState(1)
    const [pinned, setPinned] = useState()
    const [messages, setMessages] = useState<Message[]>([])
    const [chatOn, setChatOn] = useState(false)
    const [attendeesOn, setAttendeesOn] = useState(false)

    useEffect(() => {
        console.log("peers change", peers)
        const w = (window.innerWidth * ((chatOn || attendeesOn) ? 0.75 : 1) - 400) / (peers.length + (sharing ? 2 : 1)) - 10

        setCardWidth(w < 400 ? 400 : w > 1000 ? 1000 : w)
        console.log("wwwwwwwwww", w < 400 ? 400 : w > 1000 ? 1000 : w, w)

        // if(peers.length>4){
        //     setCardWidth((window.innerWidth-400)/4-10)
        // }else{
        //     setCardWidth()
        // }


    }, [peers, sharing,chatOn,attendeesOn])

    const add = (data: PeerData[]) => {
        const tmp = data.filter((it) => !peers.some((i) => it.user.id === i.user.id))


        setPeers(prs => [...prs, ...tmp])

        // if (!peers.some((it) => it.user.id === data.user.id)) {
        //     console.log("adddddd hook")
        //     setPeers([...peers, ...data])
        // }
    }
    return { peers, add, cardWidth, ngrid, sharing, setSharing, pinned, setPinned, setPeers, messages, setMessages, chatOn, setChatOn, attendeesOn, setAttendeesOn }
}

export default usePeers