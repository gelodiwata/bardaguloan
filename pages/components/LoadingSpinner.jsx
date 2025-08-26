import React from 'react'

export default function LoadingSpinner({ size = 'md', color = 'primary' }) {
    const sizeClass = {
        'sm': 'loading-sm',
        'md': 'loading-md',
        'lg': 'loading-lg',
        'xl': 'loading-xl'
    }[size] || 'loading-md';

    const colorClass = {
        'primary': 'text-primary',
        'secondary': 'text-secondary',
        'accent': 'text-accent',
        'neutral': 'text-neutral',
        'info': 'text-info',
        'success': 'text-success',
        'warning': 'text-warning',
        'error': 'text-error'
    }[color] || 'text-primary';

    return (
        <div className="flex justify-center items-center">
            <span className={`loading loading-spinner ${sizeClass} ${colorClass} animate-pulse`}></span>
        </div>
    )
}