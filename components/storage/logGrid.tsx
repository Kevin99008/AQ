// LogGrid.tsx
import React from 'react';
import Image from 'next/image';
import classes from './page.module.css';
import { StaticImageData } from 'next/image';

type Log = {
  id: number;
  title: string;
  imageUrl: string | StaticImageData;
  quantity: number;
};

interface LogGridProps {
  logsData: Log[];
  isEditing: boolean;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onAddQuantity: (id: number) => void;
  onDiscardQuantity: (id: number) => void;
}

const LogGrid: React.FC<LogGridProps> = ({
  logsData,
  isEditing,
  onQuantityChange,
  onAddQuantity,
  onDiscardQuantity,
}) => {
  return (
    <div className={classes.grid}>
      {logsData.map((log) => (
        <div key={log.id} className={classes.gridItem}>
          <h3>{log.title}</h3>
          <Image
            src={log.imageUrl}
            alt={log.title}
            width={200}
            height={200}
            className={classes.image}
          />
          {isEditing ? (
            <div className={classes.quantityControl}>
              <button onClick={() => onDiscardQuantity(log.id)}>-</button>
              <input
                type="number"
                value={log.quantity}
                onChange={(e) => onQuantityChange(log.id, Number(e.target.value))}
                min="0"
                className={classes.quantityInput}
              />
              <button onClick={() => onAddQuantity(log.id)}>+</button>
            </div>
          ) : (
            <span>{log.quantity}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default LogGrid;
