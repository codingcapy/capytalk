/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: messages component for CapyTalk client
 */


import { useState, useEffect, useRef } from "react";

export default function Message(props) {

    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [messageContent, setMessageContent] = useState(props.message.content);
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
        <div className="py-2 message-container group hover:bg-slate-600 transition-all ease duration-300">
            <div className="flex"><div className="font-bold px-1">{props.message.username}</div><div className="pl-2">on {props.message.date}</div></div>
            <div className="md:flex justify-between px-1">
                {!editMode && <div>
                    <div className="overflow-wrap break-word pb-1">{props.message.content}</div>
                </div>}
                {editMode && <form onSubmit={props.handleEditMessage}>
                    <input type="text" name="content" id="content" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} className="text-black" />
                    <input name="messageid" id="messageid" defaultValue={`${props.message.messageId}`} className="hidden" />
                    <button className="edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl">Edit</button>
                    <button  className="delete-btn cursor-pointer px-2 mx-1 bg-red-600 rounded-xl"onClick={() => setEditMode(false)}>Cancel</button>
                </form>}
                <div className=" edit-delete hidden group-hover:flex opacity-100 transition-opacity">
                    {!editMode && <div onClick={() => setEditMode(true)} className="edit-btn cursor-pointer px-2 mr-1 bg-slate-800 rounded-xl">Edit</div>}
                    {!editMode && <form onSubmit={props.handleEditMessage}>
                        <input name="content" id="content" defaultValue="[this message was deleted]" className="hidden" />
                        <input name="messageid" id="messageid" defaultValue={`${props.message.messageId}`} className="hidden" />
                        <button type="submit" className="delete-btn cursor-pointer px-2 mx-1 bg-red-600 rounded-xl">Delete</button>
                    </form>}
                </div>
            </div>
        </div>
    )
}