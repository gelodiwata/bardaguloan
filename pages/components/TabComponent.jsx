import React, { useEffect, useState } from 'react'
import UnpaidComponent from './TransactionComponent'
import PersonOfInterestComponent from './PersonOfInterestComponent';
import IndividualForm from './IndividualForm';
import BatchForm from './BatchForm';
import MyUtangsComponent from './MyUtangsComponent';
import ResiboComponent from './ResiboComponent';
import { firebaseService } from '../../lib/firebaseService';
import { useToast } from '../../contexts/ToastContext';


export default function TabComponent({ currentUser, utangs, setUtangs }) {
    const { showToast } = useToast();
    const [editingUtang, setEditingUtang] = useState(null);
    const handleSubmit = async (utangData, originalUtang) => {
        try {
            if (originalUtang && originalUtang.id) {
                // Editing existing utang
                const result = await firebaseService.updateUtang(originalUtang.id, utangData);
                if (result.success) {
                    showToast('Utang updated successfully!', 'success');
                } else {
                    showToast('Failed to update utang: ' + result.error, 'error');
                }
            } else {
                // Adding new utang
                const result = await firebaseService.addUtang(utangData);
                if (result.success) {
                    showToast('Utang added successfully!', 'success');
                } else {
                    showToast('Failed to add utang: ' + result.error, 'error');
                }
            }
            setEditingUtang(null);
        } catch (error) {
            console.error('Error handling utang submission:', error);
            showToast('An unexpected error occurred', 'error');
        }
    };


    useEffect(() => {
        const handleEditRequest = () => {
            handleModalOpen();
        };
        window.addEventListener('utangEditRequest', handleEditRequest);
        return () => window.removeEventListener('utangEditRequest', handleEditRequest);
    }, []);

    const handleModalOpen = () => {
        const storedUtang = sessionStorage.getItem('editingUtang');
        if (storedUtang) {
            setEditingUtang(JSON.parse(storedUtang));
            sessionStorage.removeItem('editingUtang');
        } else {
            setEditingUtang(null);
        }
    };


    return (
        <div className='w-full h-screen relative'>
            <div className="tabs tabs-border h-auto w-full">
                <input type="radio" name="my_tabs_2" className="tab" aria-label="Lahat" defaultChecked />
                <div className="tab-content border-base-300 bg-base-100">
                    <UnpaidComponent utangs={utangs} setUtangs={setUtangs} currentUser={currentUser} />
                </div>

                <input type="radio" name="my_tabs_2" className="tab" aria-label="Utang ko" />
                <div className="tab-content bg-base-100 border-base-300 p-3">
                    <MyUtangsComponent utangs={utangs} setUtangs={setUtangs} currentUser={currentUser} />
                </div>
                
                <input type="radio" name="my_tabs_2" className="tab" aria-label="Resibo" />
                <div className="tab-content border-base-300 bg-base-100">
                    <ResiboComponent utangs={utangs} currentUser={currentUser} />
                </div>
            </div>
            
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
                <button 
                    onClick={() => document.getElementById('person_of_interest_modal').showModal()} 
                    className="btn btn-circle btn-primary bg-indigo-500 hover:bg-indigo-600 shadow-lg"
                    title="Person of Interest"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </button>
                <button 
                    onClick={() => {
                        handleModalOpen();
                        document.getElementById('my_modal_1').showModal();
                    }} 
                    className="btn btn-circle btn-primary bg-indigo-500 hover:bg-indigo-600 shadow-lg"
                    title="Utang recorder"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
            <PersonOfInterestComponent utangs={utangs} currentUser={currentUser} setUtangs={setUtangs} />
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box flex flex-col gap-3">
                    <h3 className="font-bold text-lg">Log an utang</h3>
                    <span className="text-xs opacity-60 tracking-wide">List utang by batch or individual</span>
                    <div className="tabs tabs-box w-full">
                        <input type="radio" name="my_tabs_6" className="tab" aria-label="Individual" defaultChecked />
                        <div className="tab-content bg-base-100 border-base-300 p-3">
                            <IndividualForm
                                onSubmit={handleSubmit}
                                currentUser={currentUser}
                                editData={editingUtang}
                            />
                        </div>

                        <input type="radio" name="my_tabs_6" className="tab" aria-label="Batch" />
                        <div className="tab-content bg-base-100 border-base-300 p-3">
                            <BatchForm
                                onSubmit={handleSubmit}
                                currentUser={currentUser}
                            />
                        </div>
                    </div>
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
