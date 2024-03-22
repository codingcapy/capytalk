
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: message component for CapyTalk client
 */

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import { FaReply } from "react-icons/fa";

const socket = io("https://capytalk-server-production.up.railway.app");

export default function MessageFriend(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [replyMode, setReplyMode] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const messagesEndRef = useRef(null);

    async function handleReply(e) {
        e.preventDefault();
        const content = e.target.content.value;
        const currentUser = props.user.username;
        const replyContent = props.message.content;
        const replyUsername = props.message.username;
        const message = { content, user: currentUser, chatId: props.currentChat.chatId, replyContent, replyUsername };
        const res = await axios.post(`${DOMAIN}/api/messages`, message);
        if (res?.data.success) {
            const newMessages = await axios.get(`${DOMAIN}/api/messages/${props.currentChat.chatId}`);
            props.setCurrentMessages(newMessages.data);
            setReplyMode(false);
            socket.emit("message", message);
        }
        else {
            setInputMessage("");
        }
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

    return (
        <div className="py-2 message-container group hover:bg-slate-600 transition-all ease duration-300">
            {props.message.replyContent && <div className="text-gray-400 pb-1"><span className="font-bold">@{props.message.replyUsername}</span> {props.message.replyContent}</div>}
            <div className="flex"><div className="font-bold px-1">{props.message.username}</div><div className="pl-2">on {props.message.date.slice(0,10)} {props.message.date.slice(11,19)}</div></div>
            <div className="md:flex justify-between px-1">
                <div>
                    <div className="overflow-wrap break-word pb-1">{props.message.content}</div>
                </div>
                {replyMode && <form onSubmit={handleReply}>
                    <input type="text" name="content" id="content" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="text-black" />
                    <input name="messageid" id="messageid" defaultValue={`${props.message.messageId}`} className="hidden" />
                    <button className="edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl">Reply</button>
                    <button className="delete-btn cursor-pointer px-2 mx-1 bg-red-600 rounded-xl" onClick={() => setReplyMode(false)}>Cancel</button>
                </form>}
                <div className=" edit-delete hidden group-hover:flex opacity-100 transition-opacity">
                    {!replyMode && <div onClick={() => setReplyMode(true)} className="flex edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all ease duration-300">Reply <FaReply size={20} className="ml-2 pt-1" /></div>}
                </div>
            </div>
        </div>
    )
}