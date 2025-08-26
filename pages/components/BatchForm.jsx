import React, { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { firebaseService } from '../../lib/firebaseService'

export default function BatchForm({ onSubmit, currentUser, userId }) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        selectedNames: [],
        item: '',
        amount: '',
        to: currentUser,
        date: new Date().toISOString().split('T')[0],
        paid: false
    });

    const availableNames = ['Aira', 'Gelo', 'Mich', 'Pris', 'Rubie', 'TJ'];

    const handleNameToggle = (name) => {
        setFormData(prev => {
            const isSelected = prev.selectedNames.includes(name);
            return {
                ...prev,
                selectedNames: isSelected
                    ? prev.selectedNames.filter(n => n !== name)
                    : [...prev.selectedNames, name]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            showToast('User not authenticated', 'error');
            return;
        }

        if (formData.selectedNames.length === 0 || !formData.item || !formData.amount) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        const utangsToAdd = formData.selectedNames.map(name => ({
            name: name,
            img: `${name.toLowerCase()}.png`,
            details: {
                amount: Number(formData.amount),
                to: formData.to,
                item: formData.item,
                date: formData.date,
                paid: formData.paid
            }
        }));

        try {
            const result = await firebaseService.addBatchUtangs(userId, utangsToAdd);
            
            if (result && result.success) {
                showToast(`${formData.selectedNames.length} utang records added successfully!`, 'success');
                
                // Reset form
                setFormData({
                    selectedNames: [],
                    item: '',
                    amount: '',
                    to: currentUser,
                    date: new Date().toISOString().split('T')[0],
                    paid: false
                });
                
                // Close the modal
                document.getElementById('my_modal_1').close();
            } else {
                showToast('Failed to add utangs: ' + (result?.error || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error adding batch utangs:', error);
            showToast('An unexpected error occurred. Please try again.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Sinong may utang? (Select multiple)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {availableNames.map(name => (
                        <label key={name} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-base-200">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={formData.selectedNames.includes(name)}
                                onChange={() => handleNameToggle(name)}
                            />
                            <span>{name}</span>
                        </label>
                    ))}
                </div>
                {formData.selectedNames.length === 0 && (
                    <div className="text-error text-xs mt-1">Please select at least one person</div>
                )}
            </div>

            <label className="input">
                <input
                    type="text"
                    className="grow"
                    placeholder="Ano ang inutang?"
                    value={formData.item}
                    onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
                    required
                />
            </label>

            <label className="input">
                <span className="opacity-60 tracking-wide">µ</span>
                <input
                    type="number"
                    className="grow"
                    placeholder="Magkano ang utang?"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                />
            </label>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                    {formData.selectedNames.length > 0 && (
                        <span>Creating {formData.selectedNames.length} utang records</span>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={formData.selectedNames.length === 0}
                >
                    Save All
                </button>
            </div>
        </form>
    );
}