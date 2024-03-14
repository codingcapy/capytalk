
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: dashboard for CapyTalk client
 */

import { NavLink, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import DOMAIN from "../services/endpoint";
import useAuthStore from "../store/AuthStore";
import Friends from "../components/Friends";
import Chats from "../components/Chats";
import Messages from "../components/Messages";
import AddFriend from "../components/AddFriend";
import FriendProfile from "../components/FriendProfile";
import Profile from "../components/Profile";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline, IoChatbubbleOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";

const socket = io("https://capytalk-server-production.up.railway.app");

export default function Dashboard() {

    const data = useLoaderData()
    const initFriends = []
    data.forEach((friend) => { initFriends.push(friend.username) })
    const { logoutService, user } = useAuthStore((state) => state);
    const [chatsMode, setChatsMode] = useState(true);
    const [friendsMode, setFriendsMode] = useState(false);
    const [showDefault, setShowDefault] = useState(true);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showFriend, setShowFriend] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isMenuSticky, setIsMenuSticky] = useState(false);
    const [friend, setFriend] = useState("");
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [inputChat, setInputChat] = useState("");
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        async function getFriends() {
            const friends = await axios.get(`${DOMAIN}/api/user/friends/${user.userId}`)
            const newFriends = []
            friends.data.forEach((friend) => { newFriends.push(friend.username) })
            setFriends(newFriends)
        }
        getFriends()
    }, [user.userId])

    function tappedChats() {
        setChatsMode(true);
        setFriendsMode(false);
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedChat() {
        setChatsMode(false);
        setShowMessages(true);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedFriends() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(true);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedAddFriend() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(true);
        setShowFriend(false);
        setShowProfile(false);
    }

    function tappedFriend() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(true);
        setShowProfile(false);
    }

    function tappedProfile() {
        setChatsMode(false);
        setShowMessages(false);
        setFriendsMode(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowProfile(true);
    }

    function clickedAddFriend() {
        setShowMessages(false);
        setShowAddFriend(true);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(false);
        tappedAddFriend();
    }

    async function clickedChat(chat) {
        const newChat = await axios.get(`${DOMAIN}/api/chats/${chat.chatId}`);
        const newMessages = await axios.get(`${DOMAIN}/api/messages/${chat.chatId}`);
        setCurrentChat(newChat.data);
        setCurrentMessages(newMessages.data);
        setShowMessages(true);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(false);
        tappedChat();
    }

    function clickedFriend(username) {
        setFriend(username);
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(true);
        setShowDefault(false);
        setShowProfile(false);
        tappedFriend();
    }

    function clickedProfile() {
        setShowMessages(false);
        setShowAddFriend(false);
        setShowFriend(false);
        setShowDefault(false);
        setShowProfile(true);
        tappedProfile();
    }

    function clickedLeaveChat() {
        setShowDefault(true);
        tappedChats();
    }

    const [message, setMessage] = useState("");

    async function handleCreateChat(e) {
        e.preventDefault();
        const currentUser = user.username;
        const currentFriend = friend;
        const title = `${currentUser}, ${currentFriend}`;
        const chat = { title, user: currentUser, friend: currentFriend };
        const res = await axios.post(`${DOMAIN}/api/chats`, chat);
        if (res?.data.success) {
            const response = await axios.get(`${DOMAIN}/api/chats/user/${user.userId}`)
            setMessage(res?.data.message);
            setChats(response.data);
            setInputChat("");
            socket.emit("chat", chat);
            const newChat = response.data[response.data.length - 1]
            clickedChat(newChat)
        }
        else {
            setMessage(res?.data.message);
            setInputChat("");
        }
    }

    async function handleCreateMessage(e) {
        e.preventDefault();
        const content = e.target.content.value;
        const currentUser = user.username;
        const message = { content, user: currentUser, chatId: currentChat.chatId };
        const res = await axios.post(`${DOMAIN}/api/messages`, message);
        if (res?.data.success) {
            const newMessage = await axios.get(`${DOMAIN}/api/messages/${currentChat.chatId}`);
            setMessage(res?.data.message);
            setCurrentMessages(newMessage.data);
            setInputMessage("");
            socket.emit("message", message);
        }
        else {
            setMessage(res?.data.message);
            setInputMessage("");
        }
    }

    useEffect(() => {
        socket.on("message", receiveMessage);
        return () => socket.off("message", receiveMessage);
    }, [currentMessages]);

    async function receiveMessage() {
        const newMessage = await axios.get(`${DOMAIN}/api/messages/${currentChat.chatId}`);
        setCurrentMessages(newMessage.data);
    }

    useEffect(() => {
        socket.on("chat", receiveChat);
        return () => socket.off("chat", receiveChat);
    }, [chats]);

    async function receiveChat() {
        const response = await axios.get(`${DOMAIN}/api/chats/user/${user.userId}`)
        setChats(response.data);
    }

    useEffect(() => {
        socket.on("friend", receiveFriend);
        return () => socket.off("friend", receiveFriend);
    }, [friends]);

    async function receiveFriend() {
        const friends = await axios.get(`${DOMAIN}/api/user/friends/${user.userId}`)
        const newFriends = []
        friends.data.forEach((friend) => newFriends.push(friend.username))
        setFriends(newFriends)
    }

    useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            setIsMenuSticky(scrollPosition > scrollThreshold);
        }
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        async function getChats() {
            const res = await axios.get(`${DOMAIN}/api/chats/user/${user.userId}`)
            setChats(res.data)
        }
        getChats()
    }, [user.userId])

    return (
        <div className="flex flex-col fixed min-h-full min-w-full mx-auto bg-slate-800 text-white">
            <main className="flex-1">
                <div className="hidden md:flex">
                    <div className="flex">
                        <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} user={user} friends={friends} setFriends={setFriends} />
                        <Chats clickedChat={clickedChat} chats={chats} />
                        {showDefault && <div className="px-5 border-2 border-slate-600 bg-slate-800 min-w-full h-screen overflow-y-auto">
                            <div className="flex text-xl sticky top-0 bg-slate-800 py-5"><IoChatbubbleOutline size={25} className="mx-2" />Messages</div>
                        </div>}
                        {showMessages && <Messages currentChat={currentChat} currentUser={user.username} user={user} handleCreateMessage={handleCreateMessage} message={message} inputMessage={inputMessage} setInputMessage={setInputMessage} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages} clickedLeaveChat={clickedLeaveChat} setChats={setChats} />}
                        {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} friends={friends} />}
                        {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} user={user} message={message} inputChat={inputChat} setInputChat={setInputChat} />}
                        {showProfile && <Profile />}
                        <div className="flex flex-col">
                            <div onClick={clickedProfile} className="flex px-2 py-5 rounded-xl hover:bg-slate-600 transition-all ease duration-300 font-bold cursor-pointer"><CgProfile size={25} className="text-center mx-2" />{user.username}</div>
                            <NavLink to="/capytalk/" onClick={logoutService} className="flex px-5 py-1 rounded-xl hover:bg-slate-600 transition-all ease duration-300">Logout<IoExitOutline size={25} className="text-center mx-2" /></NavLink>
                        </div>
                    </div>
                </div>
                <div className="px-3 flex flex-col md:hidden">
                    {chatsMode && <Chats chats={chats} clickedChat={clickedChat} />}
                    {friendsMode && <Friends clickedAddFriend={clickedAddFriend} clickedFriend={clickedFriend} user={user} friends={friends} setFriends={setFriends} />}
                    {showMessages && <Messages currentChat={currentChat} currentUser={user.username} handleCreateMessage={handleCreateMessage} setCurrentMessages={setCurrentMessages} message={message} inputMessage={inputMessage} setInputMessage={setInputMessage} currentMessages={currentMessages} />}
                    {showAddFriend && <AddFriend currentUser={user.username} setFriends={setFriends} user={user} />}
                    {showFriend && <FriendProfile handleCreateChat={handleCreateChat} friendName={friend} user={user} message={message} inputChat={inputChat} setInputChat={setInputChat} />}
                    {showProfile && <Profile />}
                </div>
            </main>
            <div className={`flex justify-between py-5 px-5 md:hidden sticky z-90 bg-slate-800 ${isMenuSticky ? "top-0" : "bottom-0"
                }`}>
                <div className="" onClick={() => tappedFriends()}>
                    <FaUserFriends size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">Friends</p>
                </div>
                <div className="" onClick={tappedChats}>
                    <IoChatbubbleEllipsesOutline size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">Chats</p>
                </div>
                <div onClick={tappedProfile} className="">
                    <CgProfile size={25} className="text-center mx-2" />
                    <p className="text-center text-xs">You</p>
                </div>
                <NavLink to="/capytalk/" onClick={logoutService} className="text-xs">
                    <IoExitOutline size={25} className="text-center mx-2" />Logout
                </NavLink>
            </div>
        </div>
    )
}

export async function dataLoader({ params }) {
    const res = await axios.get(`${DOMAIN}/api/user/friends/${params.userId}`)
    return res.data
}