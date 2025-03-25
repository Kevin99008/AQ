'use client';

import { useEffect, useState } from 'react';
import classes from "./imagePreview.module.css";
import Image from "next/image";

interface imageProp {
    images: string[];
}

export default function ImagePreview({images}: imageProp) {
  const imageList = images;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [imageList.length]);

  return (
    <div>
      {imageList.map((image, index) => (
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
            quality={50}
            className={classes.image}
          />
        </div>
      ))}
    </div>
  );
}
