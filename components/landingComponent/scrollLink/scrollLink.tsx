// components/ScrollLink.tsx
"use client"

import Link from 'next/link';

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
        <Link href={`#${id}`} onClick={handleClick}>
            {children}
        </Link>
    );
}
