
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: chat component for CapyTalk client
 */

export default function Chats(props) {

    return (
        <div className="px-5 flex-2 border-2 border-slate-600 min-w-72 h-screen overflow-y-auto ">
            <div className=" py-5 text-xl sticky top-0 bg-slate-800">Chats</div>
            <div>
                {props.chats && props.chats.map((chat) => <div key={chat.chatId} onClick={() => props.clickedChat(chat)} className="cursor-pointer">
                    {chat.title}
                </div>)}
            </div>
        </div>
    )
}