import React, { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { firebaseService } from '../../lib/firebaseService'

export default function MyUtangsComponent({ utangs, setUtangs, currentUser, userId }) {
    const { showToast } = useToast();
    const [selectedUtang, setSelectedUtang] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);

    // Filter for unpaid transactions where currentUser is the debtor
    const myUnpaidUtangs = utangs && utangs.filter(utang =>
        utang.name === currentUser && !utang.details.paid
    );

    const handleSelectUtang = (utang) => {
        setSelectedUtang(utang);
        document.getElementById('receipt_upload_modal').showModal();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setReceiptImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!selectedUtang || !receiptImage || !selectedUtang.id) return;

        // Create a copy of the utang with paid set to true
        const paidUtang = {
            ...selectedUtang,
            details: {
                ...selectedUtang.details,
                paid: true,
                receiptImage: receiptImage // Store the receipt image
            }
        };

        try {
            if (!userId) {
                showToast('User not authenticated', 'error');
                return;
            }

            const result = await firebaseService.updateUtang(userId, selectedUtang.id, paidUtang);
            
            if (result.success) {
                // Show success toast
                showToast('Utang marked as paid successfully!', 'success');

                // Reset state and close modal
                setSelectedUtang(null);
                setReceiptImage(null);
                document.getElementById('receipt_upload_modal').close();
            } else {
                showToast('Failed to mark as paid: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error marking utang as paid:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        }
    };

    return (
        <div>
            <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="p-4 pt-5 text-xs opacity-60 tracking-wide">Utang na sa iyo</li>

                {myUnpaidUtangs && myUnpaidUtangs.length === 0 ? (
                    <li className="p-4 text-center">You have no unpaid utangs! 🎉</li>
                ) : (
                    myUnpaidUtangs && myUnpaidUtangs.map((utang) => (
                        <li key={utang.id} className="list-row items-center py-5">
                            <div><img className="size-13 rounded-box" src={utang.img} alt={utang.name} /></div>
                            <div className='flex flex-row w-full gap-1 items-center justify-between'>
                                <div className="flex flex-col items-start justify-center">
                                    <h1 className='font-semibold'>You <span className='text-xs opacity-50'>owe money to</span></h1>
                                    <div className="text-sm uppercase font-black opacity-80">{utang.details.to}</div>
                                    <div className="text-sm uppercase italic font-normal opacity-60">{utang.details.item}</div>
                                </div>

                                <div className='flex flex-col items-center justify-center'>
                                    <span className="text-xs opacity-60 tracking-wide">{utang.details.date}</span>
                                    <div className="flex flex-row gap-1 items-center justify-center text-gray-400">
                                        <span className='font-semibold'>µ</span>
                                        <div className="text-xl uppercase font-bold">{utang.details.amount}</div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-primary mt-2"
                                        onClick={() => handleSelectUtang(utang)}
                                    >
                                        Upload Receipt
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Receipt Upload Modal */}
            <dialog id="receipt_upload_modal" className="modal">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg">Upload Payment Receipt</h3>
                    {selectedUtang && (
                        <div className="bg-base-200 p-3 rounded-box">
                            <p><span className="font-bold">Item:</span> {selectedUtang.details.item}</p>
                            <p><span className="font-bold">Amount:</span> µ{selectedUtang.details.amount}</p>
                            <p><span className="font-bold">To:</span> {selectedUtang.details.to}</p>
                            <p><span className="font-bold">Date:</span> {selectedUtang.details.date}</p>
                        </div>
                    )}

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Upload receipt screenshot</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered w-full"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {receiptImage && (
                        <div className="mt-2">
                            <p className="text-sm mb-2">Receipt Preview:</p>
                            <img
                                src={receiptImage}
                                alt="Receipt"
                                className="max-h-40 rounded-box mx-auto"
                            />
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn btn-primary"
                            onClick={handleMarkAsPaid}
                            disabled={!receiptImage}
                        >
                            Mark as Paid
                        </button>
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}