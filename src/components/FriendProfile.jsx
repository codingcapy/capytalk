
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friend profile component for CapyTalk client
 */

import { CgProfile } from "react-icons/cg";
import profilePic from "/capypaul01.jpg";

export default function FriendProfile(props) {

    return (
        <div className="px-5 border-2 border-slate-600 md:w-[900px] h-[90vh] md:h-screen overflow-y-auto">
            <p className="flex py-5 text-xl"><CgProfile size={25} className="text-center mx-2" />{props.friendName}</p>
            <img src={profilePic} className="max-w-30 md:max-w-xs rounded-full mx-auto pb-2" />
            <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={props.handleCreateChat}>Start Chat</button>
            <br />
            <button className="rounded-xl my-5 py-2 px-2 bg-red-900 text-white" >Block</button>
        </div>
    )
}