import React from 'react'

export default function UserSelectorComponent({ currentUser, setCurrentUser }) {
    const availableUsers = ['Aira', 'Gelo', 'Mich', 'Pris', 'Rubie', 'TJ'];

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img alt="User avatar" src={`/${currentUser ? currentUser.toLowerCase() : 'default'}.png`} />
                </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                {availableUsers.map(user => (
                    <li key={user}>
                        <a 
                            className={`flex items-center gap-2 ${currentUser === user ? 'active' : ''}`}
                            onClick={() => setCurrentUser(user)}
                        >
                            <div className="avatar">
                                <div className="w-8 rounded-full">
                                    <img src={`/${user.toLowerCase()}.png`} alt={`${user}'s avatar`} />
                                </div>
                            </div>
                            {user}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}