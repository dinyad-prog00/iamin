const NoVideo = ({name}:{name:string})=>{
    return (
        <div className="w-full h-full flex flex-col items-center justify-center rounded-xl bg-gray-400">
                <div className="h-16 w-16  rounded-full bg-teal-500 text-center">
                    <span className="block m-4 text-2xl text-white">{name.substring(0,1).toLocaleUpperCase()}</span>
                </div>
        </div>
    )
}

export default NoVideo