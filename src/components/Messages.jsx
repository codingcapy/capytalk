
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: messages component for CapyTalk client
 */

import { useState, useEffect, useRef } from "react";

export default function Messages(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setIsMenuSticky(scrollPosition > scrollThreshold);
        }
        window.addEventListener("scroll", handleScroll);
        scrollToBottom();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [props.currentMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="px-5 border-2 border-slate-600 bg-slate-800 w-80 md:w-[900px] h-[75vh] md:h-screen overflow-y-auto">
            <div className="text-xl sticky top-0 bg-slate-800 py-5">{props.currentChat.title}</div>
            <div className="sticky top-16 bg-slate-800 py-5 cursor-pointer hover:bg-slate-600 transition-all ease duration-300">+ Invite friend</div>
            <div className="overflow-hidden">
                {props.currentMessages.map((message) =>
                    props.currentUser === message.username
                        ? <div key={message.messageId} className="py-2 message-container group hover:bg-slate-600 transition-all ease duration-300">
                            <div className="flex"><div className="font-bold px-1">{message.username}</div><div className="pl-2">on {message.date}</div></div>
                            <div className="md:flex justify-between px-1">
                                <div>
                                    <div className="overflow-wrap break-word pb-1">{message.content}</div>
                                </div>
                                <div className="flex edit-delete opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="edit-btn cursor-pointer px-2 mr-1 py-2 bg-slate-800 rounded-xl">Edit</div>
                                    <div className="delete-btn cursor-pointer px-2 mx-1 py-2 bg-red-600 rounded-xl">Delete</div>
                                </div>
                            </div>
                        </div>
                        : <div key={message.messageId} className="py-2 hover:bg-slate-600 transition-all ease duration-300">
                            <div className="flex"><div className="font-bold">{message.username}</div><div className="pl-2">on {message.date}</div></div>
                            <div className="overflow-wrap break-word">{message.content}</div>
                        </div>)}
                <div ref={messagesEndRef} />
            </div>
            <div className={`py-2 md:py-10 bg-slate-800 sticky z-20 ${isMenuSticky ? "top-0" : "bottom-0"}`}>
                <form onSubmit={props.handleCreateMessage}>
                    <div className="flex">
                        <input type="text" id="content" name="content" placeholder="write a message" value={props.inputMessage} onChange={(e) => props.setInputMessage(e.target.value)} required className="py-2 px-2 my-2 rounded-xl md:w-[800px] text-black" />
                        <button type="submit" className="mx-1 px-1 md:mx-2 md:px-5 rounded-xl bg-yellow-600 text-white">Send</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
