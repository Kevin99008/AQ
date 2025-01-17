// components/GoogleMapComponent.tsx
'use client'
import classes from './map.module.css'; // Import the CSS module
import map from '@/assets/map.jpg';
import Image from "next/image";

export default function MapComponent() {
    return (
        <div className={classes.card}>
            <span className={classes.title}>Address</span>
            <Image src={map} alt={map.src} width={600} className={classes.image}/>
            <span className={classes.text}>
            8 ม.6 ถ.ซุปเปอร์ไฮเวย์ เชียงใหม่-ลำปาง ต.หนองป่าครั่ง อ.เมือง, Chiang Mai, Thailand, 50000
            </span>
        </div>
    );
}
