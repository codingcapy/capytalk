
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: messages component for CapyTalk client
 */

import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import io from "socket.io-client";
import { IoExitOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import MessageFriend from "./MessageFriend";
import { MdModeEditOutline } from "react-icons/md";
import { FaEllipsis } from "react-icons/fa6";

const socket = io("https://capytalk-server-production.up.railway.app");

export default function Messages(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [leaveChatMode, setLeaveChatMode] = useState(false)
    const [menuMode, setMenuMode] = useState(false)
    const messagesEndRef = useRef(null);

    function toggleMenuMode() {
        setMenuMode(!menuMode)
    }

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

    async function handleLeaveChat() {
        const content = `${props.currentUser} left the chat`;
        const currentUser = "notification";
        const message = { content, user: currentUser, chatId: props.currentChat.chatId };
        await axios.post(`${DOMAIN}/api/messages`, message);
        socket.emit("message", message);
        const userId = props.user.userId;
        const chatId = props.currentChat.chatId;
        const res = await axios.post(`${DOMAIN}/api/chats/chat/${props.currentChat.chatId}`, { userId, chatId })
        if (res.data.success) {
            props.clickedLeaveChat();
            const response = await axios.get(`${DOMAIN}/api/chats/user/${props.user.userId}`)
            props.setChats(response.data);
        }
        else {
            console.log(res?.data.message)
        }
    }

    return (
        <div className="px-5 border-2 border-slate-600 mx-auto bg-slate-800 w-[330px] md:w-[900px] h-[77vh] md:h-screen overflow-y-auto">
            <div className="flex justify-between py-5 sticky top-0 bg-slate-800">
                <div className="flex md:text-xl"><IoChatbubbleEllipsesOutline size={25} className="text-center mx-2" />{props.currentChat.title} <button><MdModeEditOutline size={20} className="ml-2" /></button></div>
                <div>
                    <button onClick={toggleMenuMode} className="bg-slate-800 hover:bg-slate-600 transition-all ease duration-300 py-2 px-2 rounded-full"><FaEllipsis /></button>
                </div>
            </div>
            {menuMode && <div className="sticky top-16 bg-slate-900 z-[99]">
                <button onClick={() => setLeaveChatMode(true)} className="absolute right-0 flex delete-btn cursor-pointer px-2 mx-1 bg-red-900 rounded-xl hover:bg-red-600 transition-all ease duration-300 z-[99]">Leave Chat<IoExitOutline size={25} className="text-center mx-2" /></button>
            </div>}
            <div className="sticky top-16 bg-slate-800 py-5 cursor-pointer hover:bg-slate-600 transition-all ease duration-300">+ Invite friend</div>
            <div className="overflow-hidden">
                {leaveChatMode && <div className="absolute z-[99] py-12 px-2 md:px-10 bg-slate-800 border border-white md:top-[20%] md:left-[40%] flex flex-col">
                    <div className="py-2">Are you sure you want to leave chat?</div>
                    <div className="mx-auto py-2">
                        <button onClick={handleLeaveChat} className="edit-btn cursor-pointer px-5 py-2 bg-slate-700 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Yes</button>
                        <button onClick={() => setLeaveChatMode(false)} className="delete-btn cursor-pointer px-5 py-2 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300">No</button>
                    </div>
                </div>}
                {props.currentMessages.map((message) =>
                    props.currentUser === message.username
                        ? <Message key={message.messageId} currentMessages={props.currentMessages} currentChat={props.currentChat} message={message} setCurrentMessages={props.setCurrentMessages} />
                        : <MessageFriend key={message.messageId} currentMessages={props.currentMessages} currentChat={props.currentChat} message={message} setCurrentMessages={props.setCurrentMessages} user={props.user} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className={`py-2 md:py-10 bg-slate-800 sticky z-20 ${isMenuSticky ? "top-0" : "bottom-0"}`}>
                <form onSubmit={props.handleCreateMessage}>
                    <div className="flex">
                        <input type="text" id="content" name="content" placeholder="write a message" value={props.inputMessage} onChange={(e) => props.setInputMessage(e.target.value)} required className="py-2 px-2 my-2 rounded-xl md:w-[800px] text-black" />
                        <button type="submit" className="mx-1 px-3 md:mx-2 md:px-5 rounded-3xl bg-yellow-600 text-white"><LuSendHorizonal size={25} /></button>
                    </div>
                </form>
            </div>
        </div>
    )
}
