import React from 'react'

export default function PersonOfInterestComponent({ utangs, currentUser, setUtangs }) {
    // Filter for unpaid transactions where currentUser is the recipient
    const relevantUtangs = utangs && utangs.filter(utang =>
        !utang.details.paid && utang.details.to === currentUser
    );

    const handleEdit = (utang) => {
        // Store the utang being edited in sessionStorage
        sessionStorage.setItem('editingUtang', JSON.stringify(utang));
        // Dispatch a custom event to notify TabComponent
        window.dispatchEvent(new Event('utangEditRequest'));
        // Close the current modal
        document.getElementById('person_of_interest_modal').close();
        // Open the edit modal
        document.getElementById('my_modal_1').showModal();
    };

    const handleMarkAsPaid = (utang) => {
        // Create a copy of the utang with paid set to true
        const paidUtang = {
            ...utang,
            details: {
                ...utang.details,
                paid: true
            }
        };

        // Update the utangs array
        setUtangs(prevUtangs =>
            prevUtangs.map(item =>
                // Compare by name, date and item to identify the same utang
                (item.name === utang.name &&
                    item.details.date === utang.details.date &&
                    item.details.item === utang.details.item) ? paidUtang : item
            )
        );

        // Close the modal after marking as paid
        document.getElementById('person_of_interest_modal').close();
    };

    return (
        <dialog id="person_of_interest_modal" className="modal">
            <div className="modal-box flex flex-col gap-3">
                <h3 className="font-bold text-lg">Person of Interest</h3>
                <span className="text-xs opacity-60 tracking-wide">Unpaid transactions for {currentUser}</span>
                <div className="bg-base-100">
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        {relevantUtangs && relevantUtangs.map((utang) => (
                            <li key={`${utang.name}-${utang.details.date}`} className="list-row items-center justify-center">
                                <div><img className="size-13 rounded-box" src={utang.img} alt={utang.name} /></div>
                                <div>
                                    <div className='flex flex-row w-full gap-1 items-around justify-between'>
                                        <div className="flex flex-col items-start justify-center">
                                            <h1 className='font-black'>{utang.name}</h1>
                                            <div className="text-lg uppercase italic font-normal opacity-60">{utang.details.item}</div>

                                        </div>
                                        <div className='flex flex-col items-center justify-center'>
                                            <span className="text-xs opacity-60 tracking-wide">{utang.details.date}</span>
                                            <div className='flex flex-row gap-1 items-center justify-center'><span className='font-semibold'>µ</span><div className="text-xl uppercase font-bold opacity-60">{utang.details.amount}</div></div>
                                            <div className='flex flex-row items-center gap-1'>
                                                <button
                                                    className="btn btn-square"
                                                    onClick={() => handleEdit(utang)}
                                                    title="Edit utang"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-square"
                                                    onClick={() => handleMarkAsPaid(utang)}
                                                    title="Mark as paid"
                                                >
                                                    ✅
                                                </button>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}
