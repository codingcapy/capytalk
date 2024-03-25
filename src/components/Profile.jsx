
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: profile component for CapyTalk client
 */

import useAuthStore from "../store/AuthStore"
import DOMAIN from "../services/endpoint"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CgProfile } from "react-icons/cg";
import profilePic from "/capypaul01.jpg";

export default function Profile() {
    const { user } = useAuthStore((state) => state)
    const [editMode, setEditMode] = useState(false)
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function toggleEditMode() {
        setEditMode(!editMode)
    }

    async function handleEditPassword(e) {
        e.preventDefault()
        const password = e.target.password.value;
        const userId = user.userId
        const updatedUser = { password };
        const res = await axios.post(`${DOMAIN}/api/users/${userId}`, updatedUser);
        toggleEditMode();
        setMessage("Password updated successfully!")
        if (res?.data.success) {
            navigate(`/capytalk/dashboard/${userId}`);
        }
        else {
            console.log(res?.data.message)
        }
    }

    return (
        <div className="px-5 border-2 border-slate-600 md:w-[900px] h-[85vh] md:h-screen overflow-y-auto">
            <h1 className="flex text-3xl font-bold text-center py-5 "><CgProfile size={35} className="text-center mx-2" />Your Profile</h1>
            <img src={profilePic} className="max-w-30 md:max-w-xs rounded-full mx-auto pb-2" />
            <p>Username: {user.username}</p>
            {editMode
                ? <form onSubmit={handleEditPassword} className="flex flex-col">
                    <input type="password" id="password" name="password" placeholder="New Password" required className="px-2 border rounded-lg border-slate-700 py-1 text-black" />
                    <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" >Change password</button>
                    <button className="" onClick={toggleEditMode}>Cancel</button>
                </form>
                :
                <button className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white" onClick={toggleEditMode}>Change password</button>}
            <p>{message}</p>
        </div>
    )
}