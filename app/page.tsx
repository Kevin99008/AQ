import classes from "./page.module.css"
import Card from "@/components/card/card";
import Image from "next/image";
import aquakidsLogo from "@/assets/logo.png";
import playsoundLogo from "@/assets/logo2.png";
export default function Home() {
  const aquakidsData = {
    title: "AquaKids",
    detail: "Welcome to Aquakids Chiang Mai! the ultimate destination for nurturing your child's swimming skills in a fun, safe, and engaging environment!",
    description: [
      "Age-Appropriate Classes: Our programs cater to children from infancy up to 10 years old, focusing on water safety and swimming techniques tailored to each developmental stage.",
      "Engaging Learning Environment: We utilize songs, games, and water toys to create an interactive experience that encourages children to learn while having fun. This approach not only builds swimming skills but also promotes physical and emotional development.",
      "Expert Instructors: Our certified instructors are passionate about teaching and are committed to ensuring every child feels confident and safe in the water."
    ],
    logo: aquakidsLogo
  }
  
  const playsoundData = {
    title: "PlaySound",
    detail: "Experience the joy of music at Playsound Chiang Mai, the premier music school dedicated to nurturing your child's musical talents from an early age!",
    description: [
      "Expert Instructors: Our passionate teachers are dedicated to creating a nurturing environment where every child can flourish musically.",
      "Cognitive Development: Engaging with music enhances children's IQ and cognitive skills, making it a vital part of their early education.",
      "Fun Learning Environment: We believe that learning music should be enjoyable! Our interactive classes keep children excited and motivated to learn."
    ],
    logo: playsoundLogo
  }

  return (
    <>
      <div className={classes.container}>
        <Image src={aquakidsData.logo.src} alt={aquakidsData.title} width={400} height={400}/>
        <Card title={aquakidsData.title} detail={aquakidsData.detail} description={aquakidsData.description}/>
      </div>
      <div className={classes.container}>
        <Image src={playsoundData.logo.src} alt={aquakidsData.title} width={400} height={400}/>
        <Card title={playsoundData.title} detail={playsoundData.detail} description={playsoundData.description}/>
      </div>
    </>
);
}
