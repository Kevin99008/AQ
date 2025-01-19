// LogTable.tsx
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

interface LogTableProps {
  logsData: Log[];
  isEditing: boolean;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onAddQuantity: (id: number) => void;
  onDiscardQuantity: (id: number) => void;
}

const LogTable: React.FC<LogTableProps> = ({
  logsData,
  isEditing,
  onQuantityChange,
  onAddQuantity,
  onDiscardQuantity,
}) => {
  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Image</th>
          <th>Quantity</th>
          {isEditing && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {logsData.map((log) => (
          <tr key={log.id}>
            <td>{log.id}</td>
            <td>{log.title}</td>
            <td>
              <Image
                src={log.imageUrl}
                alt={log.title}
                width={100}
                height={100}
                className={classes.image}
              />
            </td>
            <td>
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
                log.quantity
              )}
            </td>
            {isEditing && (
              <td>
                {/* Optional Update button can be added here */}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LogTable;
