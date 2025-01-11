// profileCard.js
import Image from 'next/image';
import classes from './profile.module.css';
import profileImage from '@/assets/logo.png'
const mockData = {
    user: {
        username: "john_doe",
        image: profileImage,
    },
    contacts: [
        { id: 1, name: "Alice", phone: "123-456-7890" },
        { id: 2, name: "Bob", phone: "987-654-3210" },
    ],
    kids: [
        { id: 1, name: "Tommy", age: 8 },
        { id: 2, name: "Lucy", age: 5 },
    ],
};

export default function ProfileCard() {
    return (
        <div className={classes.container}>
            <div className={classes.user}>
            <div className={classes.imageProfile}>
                    <Image 
                        src={mockData.user.image} 
                        alt={`${mockData.user.username}'s profile`} 
                        width={200} 
                        height={200} 
                        className={classes.imageProfileImage}
                    />
                </div>
                <p>{mockData.user.username}</p>
            </div>
            <div>
                <h3>Contact List</h3>
                <ul>
                    {mockData.contacts.map((contact) => (
                        <li key={contact.id}>
                            {contact.name} - {contact.phone}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Kids List</h3>
                <ul>
                    {mockData.kids.map((kid) => (
                        <li key={kid.id}>
                            {kid.name} - {kid.age} years old
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
