//page.tsx of certification
import SortDropdown from "@/components/dropDown/SortDropdown";
import classes from "./page.module.css"; // Use CSS Modules for styling in Next.js

export default function homePage() {
  const courses = [
    { title: "Toddler Swimming Course", description: "Age-Appropriate Classes: Our programs cater to children from infancy up to 10 years old, focusing on water safety and swimming techniques tailored to each developmental stage.", quota: 10, completed: 10 },
  ];
    const sortOptions = ["ALL", "Aquakids course", "PlaySound", "Other"];

  return (
    <div className={classes.container}>
      <div className={classes.cardContainer}>
        Certifications
        <div className={classes.button}>
          <SortDropdown  options={sortOptions}/>
        </div>
        {courses.map((course, index) => (
          <div className={classes.card} key={index}>
            <h3 className={classes.cardTitle}>{course.title}</h3>
            <p className={classes.cardDescription}>{course.description}</p>
            <div className={classes.verifyBar}>
                <p className={classes.passed}>passed</p>
                <button className={classes.viewPDFButton}>view PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
