import classes from "./page.module.css"
import ImageBackground from "@/components/images/imageBackground";
import Card from "@/components/infoCard/card";

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
import MapComponent from "@/components/map/map";
import ScrollLink from "@/components/scrollLink/scrollLink";
import Link from "next/link";

export default function Home() {

const aquakidsData = {
  title: "AquaKids",
  intro: "Auqa Kids Chiangmai is a swimming development school for children from newborns to those aged 10 years, featuring a curriculum developed in the UK. Our facility includes an indoor pool with a filtration and disinfection system using saltwater, which prevents irritation to the eyes, unlike chlorine. Children can comfortably open their eyes underwater, as the saltwater has a concentration similar to that of tears. Additionally, the saltwater system helps nourish children's skin. Our pool is heated to international standards, ensuring that children feel relaxed and safe while learning. Our curriculum is designed to foster both physical and mental development, focusing not only on swimming skills but also on building self-confidence, water safety skills, and a love for exercise from an early age. Children will learn in a fun and welcoming environment, guided by experienced instructors who provide attentive care at every step. If you are looking for a safe and high-quality place for your child to start their swimming journey, Auqa Kids Chiangmai is the perfect choice for your family!",
  detail: "",
  description: {
      "Babies1 (B1)": { title: "Babies1 (B1)", detail: [
        "• The child can listen for the Three Ready Go signal.",
        "• The child can perform the Back Position (Twinkle) lying on the parent's shoulder.",
        "• The child can do a Safe Jump (Ready Splash) with the parent supporting them into the water in the correct position."
      ] },
"Babies2 (B2)": { title: "Babies2 (B2)", detail: [
        "• The child can perform a Safe Jump (Ready Splash) by themselves.",
        "• The child can start kicking their legs on their own.",
        "• The child can dive in the DOUBLE MOVING SWIM position without choking."
      ] },
"Toddler1 (T1)": { title: "Toddler1 (T1)", detail: [
        "• The child can kick their legs correctly.",
        "• The child can rotate their arms independently.",
        "• The child can dive without choking and without crying (releasing hands and going further)."
      ] },
"Toddler2 (T2)": { title: "Toddler2 (T2)", detail: [
        "• The child can perform a Safe Jump (Ready Splash) by themselves.",
        "• The child can start kicking their legs on their own.",
        "• The child can dive in the DOUBLE MOVING SWIM position without choking."
      ] },
"Toddler3 (T3)": { title: "Toddler3 (T3)", detail: [
        "• The child can perform a Safe Jump (Ready Splash) by themselves.",
        "• The child can start kicking their legs on their own.",
        "• The child can dive in the DOUBLE MOVING SWIM position without choking."
      ] },
"Pre-School (PS)": { title: "Pre-School (PS)", detail: [
        "• The child can perform a Safe Jump (Ready Splash) by themselves.",
        "• The child can start kicking their legs on their own.",
        "• The child can dive in the DOUBLE MOVING SWIM position without choking."
      ] },
  },
  logo: aquakidsLogo,
  previewImage: [
      AQImg1.src,
      AQImg2.src,
      AQImg3.src,
      AQImg4.src
  ]
};
  
const playsoundData = {
    title: "PlaySound",
    detail: "",
    description: {
      "Piano Class": { title: "Piano Class", detail: [
        "• Enhanced cognitive abilities and improved concentration.",
        "• Development of fine motor skills and hand-eye coordination.",
        "• A lifelong appreciation for music and the ability to play their favorite songs."
      ] },
      "Singing Class": { title: "Singing Class", detail: [
        "• Improved vocal techniques and stage presence.",
        "• Boosted self-esteem through performance opportunities.",
        "• Enhanced listening skills and musicality."
      ] },
      "Drum Class": { title: "Drum Class", detail: [
        "• Strengthened rhythm and timing skills.",
        "• Improved physical coordination and motor skills.",
        "• An outlet for energy and creativity through percussion."
      ] },
      "Guitar Class": { title: "Guitar Class", detail: [ 
        "• Development of finger dexterity and coordination.",
        "• Understanding of musical structure and rhythm.",
        "• The joy of playing popular songs and expressing creativity through music."
      ] },
  },
    logo: playsoundLogo,
    previewImage: [
      PSImg1.src,
      PSImg2.src,
      PSImg3.src,
      PSImg4.src
    ]
};

  return (
    <>
      <div className={classes.containerImage}>
        <span className={classes.text}>AquaCube</span>
        <div className={classes.subText}>Webprovider for Aquakids & Playsound Chiangmai</div>
        <ImageBackground />
      </div>
      <div className={classes.navigator}>
        <div className={classes.button}>
                    <ScrollLink
                      aria-current="page"
                      id="aquakids"
                    >
                      AquaKids
                    </ScrollLink>
        </div>
        <div className={classes.button}>
                    <ScrollLink
                      aria-current="page"
                      id="playsound"
                    >
                      PlaySound
                    </ScrollLink>
        </div>
        <div className={classes.button}>
                    <ScrollLink
                      aria-current="page"
                      id="address"
                    >
                      Address
                    </ScrollLink>
        </div>
        <div>
        <Link
              className="inline-flex items-center justify-center rounded-xl bg-black px-8 py-4 ml-4  font-semibold text-white shadow-sm transition-all duration-150 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              href="/login"
            >
              Login
            </Link>
        </div>
      </div>
        <div className={classes.container} id="aquakids">
          <Card 
                    title={aquakidsData.title} 
                    detail={aquakidsData.detail} 
                    description={aquakidsData.description} 
                    logo={aquakidsData.logo.src}
                    previewImage={aquakidsData.previewImage} 
                />
        </div>
      <div className={classes.container} id="playsound">
        <Card 
                  title={playsoundData.title} 
                  detail={playsoundData.detail} 
                  description={playsoundData.description} 
                  logo={playsoundData.logo.src} 
                  previewImage={playsoundData.previewImage}/>
      </div>
      <div className={classes.container} id="address">
        <MapComponent />
      </div>
    </>
);
}
