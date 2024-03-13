
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: header component for CapyTalk client
 */

import { NavLink } from "react-router-dom";
import { useState } from "react";
import { IoHomeSharp } from "react-icons/io5"

export default function Header() {

    const [expandedMenu, setExpandedMenu] = useState(window.innerWidth > 500 ? true : false);

    function toggleMenu() {
        setExpandedMenu(!expandedMenu);
    }

    return (
        <header className="sticky z-50 top-0 md:flex justify-between py-5 bg-indigo-600 text-white">
            {expandedMenu && <div className="flex flex-col md:flex-row">
                <NavLink to="/capytalk/" className="text-center py-2 md:py-4 px-5">CapyTalk</NavLink>
                <NavLink to="/capytalk/" className="flex py-2 md:py-4 mx-auto"><IoHomeSharp size={20} className="text-center mx-2" /> Home</NavLink>
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-4">
                <NavLink to="/capytalk/about" className="text-center py-2 md:py-4 px-5">About</NavLink>
                <NavLink to="/capytalk/contact" className="text-center py-2 md:py-4 px-5">Contact</NavLink>
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-4">
                <NavLink to="/capytalk/users/login" className="text-center py-2 md:py-4 px-5">Login</NavLink>
                <NavLink to="/capytalk/users/signup" className="text-center py-2 md:py-4 px-5">Sign Up</NavLink>
            </div>}
            {expandedMenu && <div onClick={toggleMenu} className="text-center py-2 md:py-4 text-2xl md:hidden">&#127828;</div>}
            <div className="flex justify-between md:hidden">
                {!expandedMenu && <NavLink to="/capytalk/" className="py-2 px-2 md:hidden"><div className="flex">CapyTalk</div></NavLink>}
                {!expandedMenu && <div onClick={toggleMenu} className="text-3xl md:hidden">&#127828;</div>}
            </div>
        </header>
    )
}