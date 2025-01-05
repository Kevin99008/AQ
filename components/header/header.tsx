'use client'

import Link from "next/link";
import Image from "next/image";
import classes from "./header.module.css";
import logoImg from '@/assets/logo.png'
import logoImg2 from '@/assets/logo2.png'
import NavLink from "./nav-link";

export default function MainHeader(){
    return(
        <>   
            <header className={classes.header}>
                <Link className={classes.logo} href="/">
                    <Image src={logoImg} alt="aquaKids"/>
                    AquaCube                    
                    <Image src={logoImg2} alt="playSound"/>
                </Link>

                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <NavLink href="/login">Login</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}