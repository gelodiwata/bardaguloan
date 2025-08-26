import React from 'react'

export default function PaidComponent({ utangs = [] }) {

    // Filter and display only paid utangs
    const paidUtangs = utangs?.filter(utang => utang?.details?.paid) || [];

    if (!paidUtangs.length) {
        return (
            <div>
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">List of current paid utangs</li>
                    <li className="list-row items-center justify-center p-4">
                        <div className="text-sm opacity-60">No paid utangs found</div>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <div>
            <ul className="list bg-base-100 rounded-box shadow-md">

                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">List of current paid utangs</li>

                {
                    paidUtangs.map((utang, index) => (
                        <li key={index} className="list-row items-center">
                            <div><img className="size-10 rounded-box" src={utang.img || '/vercel.svg'} alt={utang.name} /></div>
                            <div>
                                <div className='flex flex-row gap-3 items-center'>
                                    <h1 className='font-black'>{utang.name}</h1>
                                    <span className="text-xs opacity-60 tracking-wide">{utang.details?.date}</span>
                                </div>
                                <div className='flex flex-row gap-1 items-start'>
                                    <div className='flex flex-row gap-1 items-center'>paid <span>µ</span><div className="text-xs uppercase font-black opacity-60">{utang.details?.amount}</div></div>
                                    <div className="flex flex-row gap-1 items-center">
                                        <div className="text-xs uppercase font-semibold opacity-60">{utang.details?.item}</div>
                                        <div className="text-xs uppercase font-bold opacity-60"> <span className='font-normal opacity-60 normal-case'>to </span>{utang.details?.to}</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                }

            </ul>
        </div>
    )
}
