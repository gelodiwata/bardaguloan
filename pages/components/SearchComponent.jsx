import React, { useState } from 'react'

export default function SearchComponent({ utangs, setFilteredUtangs, setIsLoading }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        // Set loading state
        if (setIsLoading) setIsLoading(true);
        
        // Use setTimeout to create a small delay for better UX
        setTimeout(() => {
            if (!term.trim()) {
                // If search is empty, reset to show all utangs
                setFilteredUtangs(null);
                if (setIsLoading) setIsLoading(false);
                return;
            }

            // Filter utangs based on search term
            const filtered = utangs.filter(utang => 
                utang.name.toLowerCase().includes(term) ||
                utang.details.item.toLowerCase().includes(term) ||
                utang.details.to.toLowerCase().includes(term) ||
                utang.details.date.includes(term) ||
                utang.details.amount.toString().includes(term)
            );

            setFilteredUtangs(filtered);
            if (setIsLoading) setIsLoading(false);
        }, 300);
    };

    return (
        <div className="form-control w-full max-w-md mb-2">
            <div className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Search utangs by name, item, amount..." 
                    className="grow"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                {searchTerm && (
                    <button 
                        className="btn btn-ghost btn-circle btn-sm" 
                        onClick={() => {
                            setSearchTerm('');
                            if (setIsLoading) setIsLoading(true);
                            setTimeout(() => {
                                setFilteredUtangs(null);
                                if (setIsLoading) setIsLoading(false);
                            }, 300);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}