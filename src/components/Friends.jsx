
/*
author: Paul Kim
date: February 8, 2024
version: 1.0
description: friends component for CapyTalk client
 */

export default function Friends(props) {

    return (
        <div className="px-5 flex-2 border-2 border-slate-600 min-w-72 h-screen overflow-y-auto">
            <div className="py-5 text-xl sticky top-0 bg-slate-800">Friends</div>
            <div>
                <div className="py-5 cursor-pointer" onClick={() => props.clickedAddFriend()} >+ Add a Friend</div>
                {props.friends.map((friend) => <div key={friend} onClick={() => props.clickedFriend(friend)} className="cursor-pointer">
                    {friend}
                </div>)}
            </div>
        </div>
    )
}