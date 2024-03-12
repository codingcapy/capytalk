
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friend profile component for CapyTalk client
 */

import { useState } from "react";

export default function FriendProfile(props) {

    return (
        <div className="px-5 border-2 border-slate-600 md:w-[900px] h-[90vh] md:h-screen overflow-y-auto">
            <p className="py-5 text-xl">{props.friendName}</p>
            <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={props.handleCreateChat}>Start Chat</button>
            {props.message}
            <br />
            <button className="rounded-xl my-5 py-2 px-2 bg-red-900 text-white" >Block</button>
            {props.message}
        </div>
    )
}