import classes from "./card.module.css";

// Define the props interface
interface CardProps {
    title: string;
    detail: string;
    description: string[]; // Change to an array of strings
}

export default function Card({ title, detail, description }: CardProps) {
    // Determine which class to use based on the title
    const titleClass = title === "AquaKids" ? classes.aquaKids : 
                       title === "PlaySound" ? classes.playSound : 
                       classes.defaultTitle; // Default class if no match

    return (
        <div className={`${classes.card} ${titleClass}`}>
            <h1>{title}</h1>
            <h2>{detail}</h2>
            <ul className={classes.descriptionList}>
                {description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </div>
    );
}
