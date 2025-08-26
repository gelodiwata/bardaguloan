import React, { useState } from 'react'
import IndividualForm from './IndividualForm'
import SearchComponent from './SearchComponent'
import LoadingSpinner from './LoadingSpinner'

export default function UnpaidComponent({ utangs, setUtangs, currentUser }) {
    const [filteredUtangs, setFilteredUtangs] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = (utang) => {
        // Store the utang being edited in sessionStorage
        sessionStorage.setItem('editingUtang', JSON.stringify(utang));
        // Dispatch a custom event to notify TabComponent
        window.dispatchEvent(new Event('utangEditRequest'));
        document.getElementById('my_modal_1').showModal();
    };

    return (
        <div className="w-full max-w-md">
            <SearchComponent
                utangs={utangs}
                setFilteredUtangs={setFilteredUtangs}
                setIsLoading={setIsLoading}
            />
            {isLoading ? (
                <div className="py-8">
                    <LoadingSpinner size="lg" color="primary" />
                </div>
            ) : (
                <ul className="list bg-base-100 rounded-box shadow-md">

                    <li className="p-4 pt-5 text-xs opacity-60 tracking-wide">
                        {filteredUtangs ? `Found ${filteredUtangs.length} results` : 'List of lahat ng naging loans'}
                    </li>

                    {
                        (filteredUtangs || utangs) &&
                        (filteredUtangs || utangs).map((utang) => {
                            return (
                                <li key={utang.id} className="list-row items-center py-5 hover:bg-base-200 transition-colors duration-200">
                                    <div><img className="size-13 rounded-box" src={`/${utang.img}`} alt={utang.name} /></div>
                                    <div className='flex flex-row w-full gap-1 items-center justify-between'>
                                        <div className="flex flex-col items-start justify-center">
                                            <h1 className='font-semibold'>{utang.name} <span className='text-xs opacity-50'>{utang.details.paid ? <span className='text-success'>paid</span> : 'send money 3'}</span></h1>
                                            <div className="text-sm uppercase font-black opacity-80"> <span className='font-normal opacity-60 normal-case'></span>{utang.details.to}</div>
                                            <div className="text-sm uppercase italic font-normal opacity-60">{utang.details.item}</div>
                                        </div>

                                        <div className='flex flex-col items-center justify-center'>
                                            <span className="text-xs opacity-60 tracking-wide">{utang.details.date}</span>
                                            <div className={`flex flex-row gap-1 items-center justify-center ${utang.details.paid ? `text-success` : `text-gray-400`}`}><span className='font-semibold'>µ</span><div className="text-xl uppercase font-bold">{utang.details.amount}</div></div>
                                        </div>

                                    </div>
                                </li>
                            )
                        })
                    }




                </ul>
            )}
        </div>
    )
}
