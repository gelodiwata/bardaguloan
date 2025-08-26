import React, { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'

export default function ResiboComponent({ utangs, currentUser }) {
    const { showToast } = useToast();
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // Filter for paid transactions
    const paidUtangs = utangs && utangs.filter(utang => utang.details.paid);

    const handleViewReceipt = (utang) => {
        setSelectedReceipt(utang);
        showToast('Viewing receipt for ' + utang.details.item, 'info');
        document.getElementById('receipt_view_modal').showModal();
    };

    return (
        <div className="w-full max-w-md">
            <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Showing {paidUtangs && paidUtangs.length} paid transactions</span>
            </div>

            {paidUtangs && paidUtangs.length === 0 ? (
                <div className="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>No paid transactions yet.</span>
                </div>
            ) : (
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="p-4 pt-5 text-xs opacity-60 tracking-wide">Paid Transactions History</li>

                    {paidUtangs && paidUtangs.map((utang) => (
                        <li key={utang.id} className="list-row items-center py-5 hover:bg-base-200 transition-colors duration-200">
                            <div><img className="size-13 rounded-box" src={`/${utang.img}`} alt={utang.name} /></div>
                            <div className='flex flex-row w-full gap-1 items-center justify-between'>
                                <div className="flex flex-col items-start justify-center">
                                    <h1 className='font-semibold'>{utang.name} <span className='text-xs text-success'>paid</span></h1>
                                    <div className="text-sm uppercase font-black opacity-80"><span className='font-normal opacity-60 normal-case'></span>{utang.details.to}</div>
                                    <div className="text-sm uppercase italic font-normal opacity-60">{utang.details.item}</div>
                                </div>

                                <div className='flex flex-col items-center justify-center'>
                                    <span className="text-xs opacity-60 tracking-wide">{utang.details.date}</span>
                                    <div className="flex flex-row gap-1 items-center justify-center text-success">
                                        <span className='font-semibold'>µ</span>
                                        <div className="text-xl uppercase font-bold">{utang.details.amount}</div>
                                    </div>
                                    {utang.details.receiptImage && (
                                        <button
                                            onClick={() => handleViewReceipt(utang)}
                                            className="btn btn-xs btn-outline btn-success mt-1"
                                        >
                                            View Receipt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Receipt View Modal */}
            <dialog id="receipt_view_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Payment Receipt</h3>
                    {selectedReceipt && (
                        <>
                            <div className="bg-base-200 p-3 rounded-box mb-4">
                                <p><span className="font-bold">Item:</span> {selectedReceipt.details.item}</p>
                                <p><span className="font-bold">Amount:</span> µ{selectedReceipt.details.amount}</p>
                                <p><span className="font-bold">From:</span> {selectedReceipt.name}</p>
                                <p><span className="font-bold">To:</span> {selectedReceipt.details.to}</p>
                                <p><span className="font-bold">Date:</span> {selectedReceipt.details.date}</p>
                            </div>
                            {selectedReceipt.details.receiptImage && (
                                <figure className="flex justify-center">
                                    <img
                                        src={selectedReceipt.details.receiptImage}
                                        alt="Receipt"
                                        className="max-h-64 rounded-lg shadow-lg"
                                    />
                                </figure>
                            )}
                        </>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    )
}