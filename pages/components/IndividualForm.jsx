import React, { useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'

export default function IndividualForm({ onSubmit, currentUser, editData = null }) {
    const { showToast } = useToast();
    const defaultFormData = {
        name: '',
        item: '',
        amount: '',
        to: currentUser,
        date: new Date().toISOString().split('T')[0],
        paid: false
    };

    const [formData, setFormData] = React.useState(defaultFormData);

    // Update form data when editData changes
    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name,
                item: editData.details.item,
                amount: editData.details.amount.toString(),
                to: editData.details.to,
                date: editData.details.date,
                paid: editData.details.paid
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [editData, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.name && formData.item && formData.amount) {
            const utangData = {
                name: formData.name,
                img: `${formData.name.toLowerCase()}.png`,
                details: {
                    amount: Number(formData.amount),
                    to: formData.to,
                    item: formData.item,
                    date: formData.date,
                    paid: formData.paid
                }
            }
            onSubmit(utangData, editData ? editData : null)
            // Reset form
            setFormData({
                name: '',
                item: '',
                amount: '',
                to: currentUser,
                date: new Date().toISOString().split('T')[0],
                paid: false
            })
            // Show success toast
            showToast(editData ? 'Utang updated successfully!' : 'Utang added successfully!', 'success')
            // Close the modal
            document.getElementById('my_modal_1').close()
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <select
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="select"
                required
            >
                <option value="" disabled>Sinong may utang?</option>
                <option>Aira</option>
                <option>Gelo</option>
                <option>Mich</option>
                <option>Pris</option>
                <option>Rubie</option>
                <option>TJ</option>
            </select>
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
            <button type="submit" className="btn btn-primary mt-2">Save</button>
        </form>
    )
}

