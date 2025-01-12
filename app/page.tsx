import classes from "./page.module.css"
import ImageBackground from "@/components/images/imageBackground";
import Card from "@/components/InfoCard/card";

import aquakidsLogo from "@/assets/logo.png";
import playsoundLogo from "@/assets/logo2.png";
import AQImg1 from "@/assets/aquaKids/1.jpg";
import AQImg2 from "@/assets/aquaKids/2.jpg";
import AQImg3 from "@/assets/aquaKids/3.jpg";
import AQImg4 from "@/assets/aquaKids/4.jpg";
import PSImg1 from "@/assets/playsound/1.jpg";
import PSImg2 from "@/assets/playsound/2.jpg";
import PSImg3 from "@/assets/playsound/3.jpg";
import PSImg4 from "@/assets/playsound/4.jpg";

export default function Home() {

  const aquakidsData = {
    title: "AquaKids",
    detail: "Welcome to Aquakids Chiang Mai! the ultimate destination for nurturing your child's swimming skills in a fun, safe, and engaging environment!",
    description: [
      "Age-Appropriate Classes: Our programs cater to children from infancy up to 10 years old, focusing on water safety and swimming techniques tailored to each developmental stage.",
      "Engaging Learning Environment: We utilize songs, games, and water toys to create an interactive experience that encourages children to learn while having fun. This approach not only builds swimming skills but also promotes physical and emotional development.",
      "Expert Instructors: Our certified instructors are passionate about teaching and are committed to ensuring every child feels confident and safe in the water."
    ],
    logo: aquakidsLogo,
    previewImage: [
      AQImg1.src,
      AQImg2.src,
      AQImg3.src,
      AQImg4.src
    ]
  }
  
  const playsoundData = {
    title: "PlaySound",
    detail: "Experience the joy of music at Playsound Chiang Mai, the premier music school dedicated to nurturing your child's musical talents from an early age!",
    description: [
      "Expert Instructors: Our passionate teachers are dedicated to creating a nurturing environment where every child can flourish musically.",
      "Cognitive Development: Engaging with music enhances children's IQ and cognitive skills, making it a vital part of their early education.",
      "Fun Learning Environment: We believe that learning music should be enjoyable! Our interactive classes keep children excited and motivated to learn."
    ],
    logo: playsoundLogo,
    previewImage: [
      PSImg1.src,
      PSImg2.src,
      PSImg3.src,
      PSImg4.src
    ]
  }

  return (
    <>
      <div className={classes.containerImage}>
        <span className={classes.text}>AquaCube</span>
        <div className={classes.subText}>Webprovider for Aquakids & Playsound Chiangmai</div>
        <ImageBackground />
      </div>
      <div className={classes.container}>
        <Card title={aquakidsData.title} detail={aquakidsData.detail} description={aquakidsData.description} logo={aquakidsData.logo.src} previewImage={aquakidsData.previewImage}/>
      </div>
      <div className={classes.container}>
        <Card title={playsoundData.title} detail={playsoundData.detail} description={playsoundData.description} logo={playsoundData.logo.src} previewImage={playsoundData.previewImage}/>
      </div>
    </>
);
}
