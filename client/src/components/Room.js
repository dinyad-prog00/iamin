import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import { listeners } from "process";
import RoomSetup from "./RoomSetup";
import AttendeeCard from "./AttendeeCard";
import AttendeesList from "./AttendeesList";
import AttendeeState from "./AttendeeState";
import usePeers from "../hooks/usePeers";


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = () => {
    //const [peers, setPeers] = useState([]);
    const { peers, add, ngrid, cardWidth, sharing, setSharing, pinned, setPinned, setPeers, messages, setMessages,chatOn,setChatOn,attendeesOn,setAttendeesOn } = usePeers()
    //const [allUsers, setAllUsers] = useState([])
    const socketRef = useRef();
    const [userVideo, setUserVideo] = useState();
    const [userScreen, setUS] = useState();
    const peersRef = useRef([]);
    const { roomID } = useParams()
    const [ready, setReady] = useState(false)
    const [joined, setJoined] = useState(false)
    const [name, setName] = useState("")


    // const joinRoom = (roomID) => {
    //     console.log("joiiiiiiiiiiii")
    //     socketRef.current.emit("join room", { roomID, name });
    //     setReady(false)
    //     setJoined(true)
    // }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setUserVideo(stream)
        })
    }, [])

    const joinRoom = (room) => {
        //const room = document.getElementById("room").value
        //socketRef.current = io("http://localhost:2222", { transports: ["websocket"], query: { name } });
        socketRef.current = io( { transports: ["websocket"], query: { name } });
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setUserVideo(stream)

            socketRef.current.on("offer", ({ from, offer, name }) => {

                console.log("offer from ", from)

                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream
                })

                peer.on("error", error => {
                    console.log(error)
                })

                peer.on("signal", signal => {
                    console.log("answer to ", from)
                    socketRef.current.emit("answer", { to: from, answer: signal })
                })

                peer.on("data", (message) => {
                    const msg = { private: true, user: { id: from, name }, message: message.toString() }

                    setMessages((msgs) => [...msgs, msg])
                })

                peer.on("stream", stream => {
                    const video = document.getElementById(from)
                    if (video) {
                        video.srcObject = stream
                        console.log("stream from ", from, stream)
                    } else {
                        console.log("video card not found: ", from)
                    }

                })

                peer.signal(offer)
                peersRef.current.push({ id: from, peer })
                setPeers((prs) => [...prs, { user: { id: from, name }, peer }])


            })

            socketRef.current.on("answer", ({ from, answer }) => {
                console.log("answer from ", from)
                const peer = peersRef.current.find((it) => it.id === from)
                if (peer) {
                    peer.peer.signal(answer)
                }
                else {
                    console.log("peer not found for ", from)
                }
            })


            socketRef.current.on("new-user", ({ id, name }) => {
                console.log("new user", id)
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream
                })

                peer.on("error", error => {
                    console.log(error)
                })

                peer.on("signal", signal => {
                    console.log("offer to ", id)
                    socketRef.current.emit("offer", { offer: signal, to: id })
                })


                peer.on("data", (message) => {
                    const msg = { private: true, user: { id, name }, message: message.toString() }

                    setMessages((msgs) => [...msgs, msg])
                })

                peer.on("stream", stream => {
                    const video = document.getElementById(id)
                    if (video) {
                        video.srcObject = stream
                        // if ('srcObject' in video) {
                        //     video.srcObject = stream
                        // } else {
                        //     video.src = window.URL.createObjectURL(stream)
                        // }

                        console.log("stream ", id, stream)
                    } else {
                        console.log("video card not found: ", id)
                    }

                })
                //addVideo(id)
                peersRef.current.push({ id, peer })
                setPeers((prs) => [...prs, { user: { id, name }, peer }])
                //peers.push({ id, peer })
            })



            socketRef.current.on("message", ({ message, id, name }) => {
                const msg = { private: false, user: { id, name }, message: message }

                setMessages((msgs) => [...msgs, msg])
            })

            socketRef.current.on("user-disconnect", id => {
                console.log("user ", id, " gone")
                document.getElementById(`card-${id}`).remove()
                peersRef.current = peersRef.current.filter((it) => it.id !== id)
                setPeers((prs) => prs.filter((it) => it.user.id !== id))
            })




            socketRef.current.emit("join", { room })

            console.log(socketRef.current.id, "joined room", room)
            //addVideo(socketRef.current.id, stream)

            setReady(false)
            setJoined(true)
        })


    }

    const send = (peer, message) => {
        if (peer) {
            const msg = { private: true, user: { id: socketRef.current.id, name }, message }

            setMessages((msgs) => [...msgs, msg])
            peer.peer.send(message)
        } else {
            socketRef.current.emit("message", message)
        }
    }

    const shareScreen2 = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
            console.log("stream share")
            socketRef.current.on("share-screen-offer", ({ from, offer }) => {

                console.log("share-screen-offer from ", from)

                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream
                })

                peer.on("error", error => {
                    console.log(error)
                })

                peer.on("signal", signal => {
                    console.log("share-screen-answer to ", from)
                    socketRef.current.emit("share-screen-answer", { to: from, answer: signal })
                })


                peer.signal(offer)

                peers.push({ id: `screen-${from}`, peer })

                //addVideo(`screen-${from}`, stream)
            })



            socketRef.current.emit("share-screen-start")
        }).catch(console.log)


    }



    const shareScreen = () => {

        navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
            setUS(stream)

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });

            peer.on("signal", signal => {
                socketRef.current.emit("screen sharing", signal)
            })

            add([{ peer, user: { id: `sharing-${socketRef.current.id}`, name: `${name} sharing` }, hidden: true }])
            setSharing(true)
            setPinned(`sharing-${socketRef.current.id}`)
        })




    }


    return (
        <div className="h-screen w-full flex items-center bg-gradient-to-b from-slate-950  to-gray-950" >

            <RoomSetup userVideo={userVideo} joinRoom={() => joinRoom(roomID)} ready={ready} name={name} setName={setName} joined={joined}  roomID={roomID}/>

            {joined &&
                <AttendeesList
                    peers={peers}
                    userVideoSrc={userVideo}
                    userScreenSrc={userScreen}
                    cardWidth={cardWidth}
                    name={name}
                    shareScreen={shareScreen}
                    sharing={sharing}
                    pinned={pinned}
                    setPinned={setPinned}
                    messages={messages}
                    send={send}
                    curid={socketRef.current.id}
                    chatOn={chatOn}
                    setChatOn={setChatOn}
                    attendeesOn={attendeesOn}
                    setAttendeesOn={setAttendeesOn}
                />
            }
        </div>
    );
};

export default Room;
