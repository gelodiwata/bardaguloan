import React from 'react'

export default function PrimaryStatComponent({ utangNaMo = 1000, personalLuwal = 1000 }) {
    return (
        <div className="stats stats-horizontal shadow py-10 w-full max-w-md animate-fadeIn">
            <div className="stat px-10">
                <div className="stat-title">utang na mo</div>
                <div className="stat-value text-error">µ{utangNaMo}</div>
                <div className="stat-desc">Money you owe to others</div>
            </div>

            <div className="stat px-10">
                <div className="stat-title">personal luwal</div>
                <div className="stat-value text-success">µ{personalLuwal}</div>
                <div className="stat-desc">Money owed to you</div>
            </div>
        </div>
    )
}
