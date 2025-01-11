import SortDropdown from "@/components/dropDown/dropDown";
import classes from "./page.module.css"; // Use CSS Modules for styling in Next.js

export default function homePage() {
  // Sample data for courses with checked states
  const courses = [
    { title: "Toddler Swimming Course", description: "Age-Appropriate Classes: Our programs cater to children from infancy up to 10 years old, focusing on water safety and swimming techniques tailored to each developmental stage.", quota: 10, completed: 7 },
    { title: "Piano Course", description: "Description for Course 2", quota: 10, completed: 5 },
    { title: "Guitar", description: "Description for Course 3", quota: 10, completed: 0 },
  ];
    const sortOptions = ["ALL", "Aquakids course", "PlaySound", "Other"];

  return (
    <div className={classes.container}>
      <div className={classes.cardContainer}>
        Courses
        <div className={classes.button}>
          <SortDropdown  options={sortOptions}/>
        </div>
        {courses.map((course, index) => (
          <div className={classes.card} key={index}>
            <h3 className={classes.cardTitle}>{course.title}</h3>
            <p className={classes.cardDescription}>{course.description}</p>
            <div className={classes.checkboxContainer}>
              {Array.from({ length: course.quota }).map((_, boxIndex) => {
                const isChecked = boxIndex < course.completed; // Check if this box should be checked
                return (
                  <div
                    className={`${classes.checkbox} ${isChecked ? classes.checked : ""}`}
                    key={boxIndex}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
