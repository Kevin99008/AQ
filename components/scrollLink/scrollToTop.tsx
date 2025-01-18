"use client";

import { useEffect, useState } from "react";
import ScrollLink from "@/components/scrollLink/scrollLink";
import classes from './scrollToTop.module.css'

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${classes.scrollToTopBtn} ${isVisible ? classes.show : ''}`}>
      <ScrollLink id="top">  ↑  </ScrollLink>
    </div>
  );
}
