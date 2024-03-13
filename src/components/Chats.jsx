
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: chats component for CapyTalk client
 */

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function Chats(props) {

    return (
        <div className="px-4 flex-2 border-2 border-slate-600 min-w-72 h-[85vh] md:h-screen overflow-y-auto ">
            <div className="flex py-5 px-1 text-xl sticky top-0 bg-slate-800"><IoChatbubbleEllipsesOutline size={25} className="text-center mx-2"/>Chats</div>
            <div>
                {props.chats && props.chats.map((chat) => <div key={chat.chatId} onClick={() => props.clickedChat(chat)} className="py-2 px-1 cursor-pointer hover:bg-slate-600 transition-all ease duration-300">
                    {chat.title}
                </div>)}
            </div>
        </div>
    )
}