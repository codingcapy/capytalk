
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
import { MdModeEditOutline } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";

const socket = io("https://capytalk-server-production.up.railway.app");

export default function Message(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [messageContent, setMessageContent] = useState(props.message.content);
    const messagesEndRef = useRef(null);

    async function handleEditMessage(e) {
        e.preventDefault();
        const content = e.target.content.value;
        const messageId = e.target.messageid.value;
        const message = { content };
        const res = await axios.post(`${DOMAIN}/api/messages/update/${messageId}`, message);
        if (res?.data.success) {
            const newMessage = await axios.get(`${DOMAIN}/api/messages/${props.currentChat.chatId}`);
            props.setCurrentMessages(newMessage.data);
            setEditMode(false);
            socket.emit("message", message);
        }
        else {
            setInputMessage("");
            console.log(res?.data.message)
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
            <div className="flex"><div className="font-bold px-1">{props.message.username}</div><div className="pl-2">on {props.message.date}</div></div>
            <div className="md:flex justify-between px-1">
                {!editMode && <div>
                    <div className="overflow-wrap break-word pb-1">{props.message.content}</div>
                </div>}
                {editMode && <form onSubmit={handleEditMessage}>
                    <input type="text" name="content" id="content" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="text-black" />
                    <input name="messageid" id="messageid" defaultValue={`${props.message.messageId}`} className="hidden" />
                    <button className="edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl">Edit</button>
                    <button className="delete-btn cursor-pointer px-2 mx-1 bg-red-600 rounded-xl" onClick={() => setEditMode(false)}>Cancel</button>
                </form>}
                <div className=" edit-delete hidden group-hover:flex opacity-100 transition-opacity">
                    {!editMode && <div onClick={() => setEditMode(true)} className="flex edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all ease duration-300">Edit <MdModeEditOutline size={20} className="ml-2" /></div>}
                    {!editMode && <form onSubmit={handleEditMessage}>
                        <input name="content" id="content" defaultValue="[this message was deleted]" className="hidden" />
                        <input name="messageid" id="messageid" defaultValue={`${props.message.messageId}`} className="hidden" />
                        <button type="submit" className="flex delete-btn cursor-pointer px-2 mx-1 bg-red-800 rounded-xl hover:bg-red-600 transition-all ease duration-300">Delete <FaTrashCan size={20} className="ml-2 pt-1" /></button>
                    </form>}
                </div>
            </div>
        </div>
    )
}