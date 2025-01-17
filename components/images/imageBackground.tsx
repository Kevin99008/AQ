'use client';

import { useEffect, useState } from 'react';
import decImage1 from "@/assets/aquaKids/1.jpg";
import decImage2 from "@/assets/aquaKids/2.jpg";
import decImage3 from "@/assets/aquaKids/3.jpg";
import decImage4 from "@/assets/aquaKids/4.jpg";
import classes from "./imageBackground.module.css";
import Image from "next/image";

export default function ImageBackground() {
  const decImage = [
    decImage1,
    decImage2,
    decImage3,
    decImage4
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % decImage.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [decImage.length]);

  return (
    <div>
      {decImage.map((image, index) => (
        <div
          key={index}
          className={`${classes.imageWrapper} ${
            index === currentImageIndex ? classes.active : classes.inactive
          }`}
        >
          <Image
            src={image}
            alt={`Image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            quality={100}
            className={classes.backgroundImage}
          />
        </div>
      ))}
    </div>
  );
}
