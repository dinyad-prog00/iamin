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
    const { peers, add, ngrid, cardWidth, sharing, setSharing, pinned, setPinned } = usePeers()
    //const [allUsers, setAllUsers] = useState([])
    const socketRef = useRef();
    const [userVideo, setUserVideo] = useState();
    const [userScreen, setUS] = useState();
    //const peersRef = useRef([]);
    const { roomID } = useParams()
    const [ready, setReady] = useState(false)
    const [joined, setJoined] = useState(false)
    const [name, setName] = useState("")

    const joinRoom = (roomID) => {
        console.log("joiiiiiiiiiiii")
        socketRef.current.emit("join room", { roomID, name });
        setReady(false)
        setJoined(true)
    }

    const onUsers = useCallback((users) => {
        console.log("all users recv", users, userVideo)
        console.log("aaaaaaaaaaaa1")
        const tmpPeers = [];
        users.forEach(user => {
            const peer = createPeer(user.id, socketRef.current.id, userVideo);
            // peersRef.current.push({
            //     peerID: user.id,
            //     peer,
            // })

            tmpPeers.push({ peer, user })
        })

        add(tmpPeers)

        console.log("aaaaaaaaaaaa2")

    }, [userVideo])


    const onNewUser = useCallback((payload) => {
        console.log("aaaaaaaaaaaa3")

        console.log("aaaaaaaaaaaa7", userVideo)

        const peer = addPeer(payload.signal, payload.caller.id, userVideo);
        // peersRef.current.push({
        //     peerID: payload.caller.id,
        //     peer,
        // })

        console.log({ peer, user: payload.caller })
        add([{ peer, user: payload.caller }])


        console.log("aaaaaaaaaaaa4")

    }, [userVideo])

    const onSignal = useCallback((payload) => {
        console.log("aaaaaaaaaaaa5", peers)
        const item = peers.find(p => p.user.id === payload.id);
        console.log("on signal", item)
        //item.peer.signal(payload.signal);
        if (item.peer._pc && item.peer._pc.signalingState !== 'stable') {
            console.log("return return ", item)
            item.peer.signal(payload.signal);
        }
        console.log("aaaaaaaaaaaa6")
    }, [peers])

    const onNewScreenShare = useCallback(({ user, signal }) => {
        console.log(user, "sharing")

        const peer = new Peer({
            initiator: false,
            trickle: false,
            //stream: userVideo
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning screen sharing", { signal, id: user.id })
        })

        peer.signal(signal);

        add([{ user: { name: `Partage d'écran (${user.name})`, id: `sharing-${user.id}` }, peer }])

        setPinned(`sharing-${user.id}`)
    }, [userVideo])

    const onNewScreenShareReturn = useCallback((signal) => {
        console.log(peers, `sharing-${socketRef.current.id}`)
        const item = peers.find(p => p.user.id === `sharing-${socketRef.current.id}`);
        console.log("on signal screen", item)
        if (item.peer._pc && item.peer._pc.signalingState !== 'stable') {
            console.log("return return screen ", item)
            item.peer.signal(signal);
            
        }

    }, [peers])


    useEffect(() => {

        console.log("useffet")
        if (!socketRef.current) {
            //socketRef.current = io("/", { transports: ["websocket"] });
            socketRef.current = io({ transports: ["websocket"] });
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {

            setUserVideo(stream)
            setReady(true)




        })
    }, []);

    useEffect(() => {
        if (socketRef.current.listeners("receiving returned signal").indexOf(onSignal) === -1) {
            socketRef.current.on("receiving returned signal", onSignal)
        }
        return () => {
            socketRef.current.off("receiving returned signal", onSignal);
        };
    }, [onSignal])

    useEffect(() => {
        if (socketRef.current.listeners("all users").indexOf(onUsers) === -1) {
            socketRef.current.on("all users", onUsers)
        }

        return () => {
            socketRef.current.off("all users", onUsers);

        };
    }, [onUsers])


    useEffect(() => {

        if (socketRef.current.listeners("user joined").indexOf(onNewUser) === -1) {
            socketRef.current.on("user joined", onNewUser)
        }

        return () => {
            socketRef.current.off("user joined", onNewUser);
        };
    }, [onNewUser])

    useEffect(() => {

        if (socketRef.current.listeners("returning screen sharing").indexOf(onNewScreenShareReturn) === -1) {
            socketRef.current.on("returning screen sharing", onNewScreenShareReturn)
        }

        return () => {
            socketRef.current.off("returning screen sharing", onNewScreenShareReturn);
        };
    }, [onNewScreenShareReturn])


    useEffect(() => {
        if (socketRef.current.listeners("screen sharing").indexOf(onNewScreenShare) === -1) {
            socketRef.current.on("screen sharing", onNewScreenShare)
        }

        return () => {
            socketRef.current.off("screen sharing", onNewScreenShare);
        };
    }, [onNewScreenShare])






    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {

            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {

            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
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

            <RoomSetup userVideo={userVideo} joinRoom={() => joinRoom(roomID)} ready={ready} name={name} setName={setName} joined={joined} />

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
                />
            }
        </div>
    );
};

export default Room;
