import ImagePreview from "../images/imagePreview";
import classes from "./card.module.css";
import Image from "next/image";
import DetailCard from "./detailCard";

interface DescriptionDetail {
    title: string;
    detail: string[]; // Change skills to an array of strings
}

// Define the props interface
interface CardProps {
    title: string;
    detail: string;
    description: { [key: string]: DescriptionDetail }; // Use an index signature for description
    logo: string;
    previewImage: string[]; // Change to an array of strings
}

export default function Card({ title, detail, description, logo, previewImage }: CardProps) {
    // Determine which class to use based on the title
    const titleClass = title === "AquaKids" ? classes.aquaKids : 
                       title === "PlaySound" ? classes.playSound : 
                       title === "ArtPlay" ? classes.artplay : 
                       title === "Taekwondo" ? classes.taekwondo : 
                       classes.default; // Default class if no match

    return (
        <>
            <div className={`${classes.card} ${titleClass}`}>
                <div className={classes.cardHeader}>
                    <div className={classes.title}>
                        <Image src={logo} alt={title} width={400} height={400}/>
                        <h1>{title}</h1>
                    </div>
                    <div className={classes.imageContainer}>
                        <ImagePreview images={previewImage}/>
                    </div>
                </div>
                <h2>{detail}</h2>
                <ul className={classes.descriptionList}>
                    {Object.keys(description).map((key) => (
                        <DetailCard key={key} title={key} detail={description[key].detail} />
                    ))}
                </ul>
            </div>
        </>
    );
}
