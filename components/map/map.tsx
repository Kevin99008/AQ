// components/GoogleMapComponent.tsx
'use client'
import classes from './map.module.css'; // Import the CSS module
import map from '@/assets/map.jpg';
import Image from "next/image";
import Link from 'next/link';

export default function MapComponent() {
    return (
        <div className={classes.card}>
            <span className={classes.title}>Address</span>
            <div className={classes.mapContainer}>
                    <Image src={map} alt={map.src} width={600} className={classes.image}/>
            </div>
                    <span className={classes.text}>
                    8 Moo 6, Super Highway Chiang Mai-Lampang, Nong Pa Krang Sub-district, Mueang District, Chiang Mai, Thailand, 50000</span>
                <div className={classes.body}>
                <Link href="https://maps.app.goo.gl/VEYiXWJaiMxFqnbH9" target="_blank" passHref className={classes.button}>
                        Map
                </Link>
                </div>
        </div>
    );
}
