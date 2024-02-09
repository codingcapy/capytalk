
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

export default function Profile(){
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
        const res = await axios.post(`${DOMAIN}/api/v1/users/${userId}`, updatedUser);
        toggleEditMode();
        setMessage("Password updated successfully!")
        if (res?.data.success) {
            navigate(`/capy-finance-client/users/${userId}`);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center py-5 ">Your Profile</h1>
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