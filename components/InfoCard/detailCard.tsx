import classes from "./card.module.css";

interface DetailCardProps {
    title: string;
    detail: string[];
}

export default function DetailCard({ title, detail }: DetailCardProps) {
    return (
        <div className={`${classes.detailCard} ${classes.default}`}>
            <h2 className={classes.title}>{title}</h2>
            <ul>
                {detail.map((desc, index) => (
                    <li key={index}>{desc}</li>
                ))}
            </ul>
        </div>
    );
}

