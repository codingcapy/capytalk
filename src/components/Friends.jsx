
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friends component for CapyTalk client
 */

export default function Friends(props) {

    return (
        <div className="px-4 flex-2 border-2 border-slate-600 min-w-72 h-[85vh] md:h-screen overflow-y-auto">
            <div className="py-5 px-1 text-xl sticky top-0 bg-slate-800">Friends</div>
            <div>
                <div className="py-5 px-1 cursor-pointer hover:bg-slate-600 transition-all ease duration-300" onClick={() => props.clickedAddFriend()} >+ Add a Friend</div>
                {props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="py-2 px-1 cursor-pointer hover:bg-slate-600 transition-all ease duration-300">
                    {friend}
                </div>)}
            </div>
        </div>
    )
}