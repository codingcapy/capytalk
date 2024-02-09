
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friend profile component for CapyTalk client
 */

import { useState } from "react";

export default function FriendProfile(props) {

    const [expanded, setExpanded] = useState(false);

    return (
        <div className="px-5 border-2 border-slate-600 min-w-full h-screen overflow-y-auto">
            <p className="py-5 text-xl">{props.friendName}</p>
            {!expanded && <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={() => setExpanded(true)}>Start Chat</button>}
            {expanded && <form onSubmit={props.handleCreateChat} className="flex flex-col">
                <label htmlFor="title">Chat Title (optional)</label>
                <input type="text" name="title" id="title" defaultValue={`${props.friendName}, ${props.user.username}`} className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Start Chat</button>
            </form>}
            {props.message}
        </div>
    )
}