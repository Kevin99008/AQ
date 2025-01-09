"use client"; // Mark this as a Client Component

import React, { useState } from "react";
import classes from "./dropDown.module.css";

interface SortDropdownProps {
  options: string[];
}

const SortDropdown: React.FC<SortDropdownProps> = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={classes.dropdownContainer}>
      <button
        className={classes.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption} ▼
      </button>
      {isOpen && (
        <ul className={classes.dropdownMenu}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`${classes.dropdownItem }${
                option === selectedOption ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
