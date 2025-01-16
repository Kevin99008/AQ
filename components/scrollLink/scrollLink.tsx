// components/ScrollLink.tsx
"use client"

import Link from 'next/link';
import React from 'react';

interface ScrollLinkProps {
    id: string;
    children: React.ReactNode;
}

export default function ScrollLink({ id, children }: ScrollLinkProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Link href={`#${id}`} onClick={handleClick} className="inline-block rounded-lg px-2 mx-2 py-1 text-lg font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
            {children}
        </Link>
    );
}
