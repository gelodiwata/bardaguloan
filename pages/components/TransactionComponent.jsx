import React, { useState } from 'react'
import IndividualForm from './IndividualForm'
import SearchComponent from './SearchComponent'
import LoadingSpinner from './LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'
import { firebaseService } from '../../lib/firebaseService'

export default function UnpaidComponent({ utangs, setUtangs, currentUser }) {
    const [filteredUtangs, setFilteredUtangs] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleEdit = (utang) => {
        // Store the utang being edited in sessionStorage
        sessionStorage.setItem('editingUtang', JSON.stringify(utang));
        // Dispatch a custom event to notify TabComponent
        window.dispatchEvent(new Event('utangEditRequest'));
        document.getElementById('my_modal_1').showModal();
    };

    const handleDelete = async (utang) => {
        if (!utang.id) {
            showToast('Cannot delete: Invalid utang ID', 'error');
            return;
        }

        if (currentUser !== utang.details.to) {
            showToast('You can only delete records where you are the recipient', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to delete this utang record for ${utang.details.item}?`)) {
            try {
                const result = await firebaseService.deleteUtang(utang.id);
                if (result.success) {
                    showToast('Utang deleted successfully!', 'success');
                    // Update local state
                    const updatedUtangs = utangs.filter(item => item.id !== utang.id);
                    setUtangs(updatedUtangs);
                } else {
                    showToast('Failed to delete utang: ' + result.error, 'error');
                }
            } catch (error) {
                console.error('Error deleting utang:', error);
                showToast('An unexpected error occurred', 'error');
            }
        }
    };

    return (
        <div className="w-full max-w-md">
            {isLoading ? (
                <div className="py-8">
                    <LoadingSpinner size="lg" color="primary" />
                </div>
            ) : (
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="p-4 pt-5 text-xs opacity-60 tracking-wide">
                        {filteredUtangs ? `Found ${(filteredUtangs || utangs).length} results` : 'List of lahat ng naging loans'}
                    </li>
                    <SearchComponent
                        utangs={utangs}
                        setFilteredUtangs={setFilteredUtangs}
                        setIsLoading={setIsLoading}
                    />
                    {
                        (filteredUtangs || utangs) &&
                        (filteredUtangs || utangs).map((utang) => {
                            return (
                                <li key={utang.id} className="list-row items-center py-5 hover:bg-base-200 transition-colors duration-200">
                                    <div><img className="size-13 rounded-box" src={`/${utang.img}`} alt={utang.name} /></div>
                                    <div className='flex flex-row w-full gap-3 items-center justify-between'>
                                        <div className="flex flex-col items-start justify-center flex-1">
                                            <h1 className='font-semibold'>{utang.name} <span className='text-xs opacity-50'>{utang.details.paid ? <span className='text-success'>paid</span> : 'send money to'}</span></h1>
                                            <div className="text-sm uppercase font-black opacity-80">
                                                {utang.details.to}
                                            </div>
                                            <div className="text-sm uppercase italic font-normal opacity-60">{utang.details.item}</div>
                                        </div>

                                        <div className='flex flex-col items-center justify-center text-center mx-2'>
                                            <span className="text-xs opacity-60 tracking-wide">{utang.details.date}</span>
                                            <div className={`flex flex-row gap-1 items-center justify-center ${utang.details.paid ? `text-success` : `text-gray-400`}`}>
                                                <span className='font-semibold'>µ</span>
                                                <div className="text-xl uppercase font-bold">{utang.details.amount}</div>
                                            </div>
                                        </div>

                                        {currentUser === utang.details.to && (
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => handleEdit(utang)}
                                                    className="btn btn-xs btn-square btn-outline"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(utang)}
                                                    className="btn btn-xs btn-square btn-outline text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
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
