'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./nav-link.module.css"

// Define the props interface
interface NavLinkProps {
    href: string; // Specify that href is a string
    children: React.ReactNode; // Specify that children can be any valid React node
}

export default function NavLink( {href, children}: NavLinkProps){
    const path = usePathname();
    return(
        <Link href={href} className={path.startsWith(href) ? `${classes.link} ${classes.active}` : classes.link}>
            {children}
        </Link>
    )
}