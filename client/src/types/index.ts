import Peer from "simple-peer";
export interface User {
    id: string
    name: string
}
export interface PeerData {
    peer: Peer.Instance
    user: User
    hidden? : boolean
}

export interface Message {
    private: boolean
    user : User
    message: string
}