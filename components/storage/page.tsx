// StorageComponent.tsx
'use client';
import { useState } from 'react';
import classes from './page.module.css'; // Import the CSS module
import item1 from '@/assets/item/1.png';
import item2 from '@/assets/item/2.png';
import LogTable from '@/components/storage/logTable'; // Import the LogTable component
import LogGrid from '@/components/storage/logGrid'; // Import the LogGrid component
import Image from 'next/image';
import { StaticImageData } from 'next/image';
// Define a type for logs
type Log = {
  id: number;
  title: string;
  imageUrl: string | StaticImageData; // Allow both string and StaticImageData
  quantity: number;
};

const initialLogsData: Log[] = [
  { id: 1, title: 'Swimming Glasses', imageUrl: item1, quantity: 10 },
  { id: 2, title: 'Float Board', imageUrl: item2, quantity: 1 }
];

export default function StorageComponent() {
  const [viewType, setViewType] = useState('table'); // Default view is table
  const [logsData, setLogsData] = useState<Log[]>(initialLogsData); // State for logs data
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [newItem, setNewItem] = useState<{ title: string; quantity: number; imageUrl: string | StaticImageData }>({
    title: '',
    quantity: 0,
    imageUrl: ''
  }); // State for new item data

  const toggleView = () => {
    setViewType(viewType === 'table' ? 'grid' : 'table');
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setLogsData((prevData) =>
      prevData.map(log =>
        log.id === id ? { ...log, quantity: newQuantity } : log
      )
    );
  };

  const addQuantity = (id: number) => {
    const log = logsData.find(log => log.id === id);
    const newQuantity = (log?.quantity ?? 0) + 1; // Default to 0 if undefined
    handleQuantityChange(id, newQuantity);
  };

  const discardQuantity = (id: number) => {
    const log = logsData.find(log => log.id === id);
    const newQuantity = Math.max((log?.quantity ?? 0) - 1, 0); // Prevent negative quantities
    handleQuantityChange(id, newQuantity);
  };

  const saveChanges = () => {
    setIsEditing(false); // Exit editing mode
    // Here you could also add any additional logic needed when saving changes
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prevItem => ({
      ...prevItem,
      [name]: name === 'quantity' ? Number(value) : value // Convert quantity to number
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prevItem => ({ ...prevItem, imageUrl: reader.result as string })); // Ensure it's a string
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewItem = () => {
    if (!newItem.title || newItem.quantity <= 0) return; // Basic validation

    const newId = logsData.length + 1; // Simple ID assignment logic
    setLogsData(prevData => [
      ...prevData,
      {
        id: newId,
        title: newItem.title,
        imageUrl: newItem.imageUrl || item1, // Fallback to item1 if no image is uploaded
        quantity: newItem.quantity,
      },
    ]);

    setNewItem({ title: '', quantity: 0, imageUrl: '' }); // Reset form
  };

  return (
    <div className={classes.container}>
      <button onClick={toggleView} className={classes.toggleButton}>
        Switch to {viewType === 'table' ? 'Grid' : 'Table'} View
      </button>
      <button onClick={() => setIsEditing(!isEditing)} className={classes.editButton}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>

      {/* New Item Form */}
      <div className={classes.newItemForm}>
        <h2>Add New Item</h2>
        <input 
          type="text" 
          name="title" 
          placeholder="Item Name" 
          value={newItem.title} 
          onChange={handleNewItemChange} 
          className={classes.inputField}
        />
        <input 
          type="number" 
          name="quantity" 
          placeholder="Quantity" 
          value={newItem.quantity} 
          onChange={handleNewItemChange}
          min="0" 
          className={classes.inputField}
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className={classes.inputField}
        />
        {newItem.imageUrl && (
          typeof newItem.imageUrl === 'string' ? (
            <img src={newItem.imageUrl} alt="Uploaded Image" width={100} height={100} />
          ) : (
            <Image src={newItem.imageUrl} alt="Uploaded Image" width={100} height={100} />
          )
        )}
        <button onClick={addNewItem} className={classes.addButton}>Add Item</button>
      </div>

      {/* Render either the table or grid based on viewType */}
      {viewType === 'table' ? (
        <LogTable 
          logsData={logsData} 
          isEditing={isEditing} 
          onQuantityChange={handleQuantityChange} 
          onAddQuantity={addQuantity} 
          onDiscardQuantity={discardQuantity} 
        />
      ) : (
        <LogGrid 
          logsData={logsData} 
          isEditing={isEditing} 
          onQuantityChange={handleQuantityChange} 
          onAddQuantity={addQuantity} 
          onDiscardQuantity={discardQuantity} 
        />
      )}

      {isEditing && (
        <div className={classes.saveContainer}>
          <button onClick={() => saveChanges()} className={classes.saveButton}>
            Save Changes
          </button>
        </div>
      )}
    </div>
   );
}