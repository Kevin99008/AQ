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
import MapComponent from "@/components/map/map";
import ScrollLink from "@/components/scrollLink/scrollLink";

export default function Home() {

const aquakidsData = {
  title: "AquaKids",
  detail: "Welcome to Aquakids Chiang Mai! The ultimate destination for nurturing your child's swimming skills in a fun, safe, and engaging environment!",
  description: {
      "Babies1 (B1)": { title: "Babies1 (B1)", detail: [
        "• น้องสามารถฟังสัญญาณ Three Raedy Goได้",
        "• น้องทำท่า Back Position (Twinkle) นอนบนไหล่ผู้ปกครองได้",
        "• น้องทำ Safe Jump (Ready Splash) โดยมีผู้ปกครองประคองน้องลงน้ำในท่าที่ถูกต้อง"
      ] },
      "Babies2 (B2)": { title: "Babies2 (B2)", detail: [
        "• น้องทำ Safe Jump (Ready Splash) ได้ด้วยตัวเอง",
        "• น้องเริ่มถีบขาเองได้",
        "• น้องสามารถดำน้ำท่า DOUBLE MOVING SWIM ได้โดยไม่สำลัก"
      ] },
      "Toddler1 (T1)": { title: "Toddler1 (T1)", detail: [
        "• น้องสามารถเตะขาได้อย่างถูกวิธี",
        "• น้องสามารถหมุนแขนได้เอง",
        "• น้องสามารถดำน้ำได้ โดยไม่สำลักและไม่ร้องไห้ (ปล่อย มือและไกลขึ้น)"
      ] },
      "Toddler2 (T2)": { title: "Toddler2 (T2)", detail: [
        "• น้องทำ Safe Jump (Ready Splash) ได้ด้วยตัวเอง",
        "• น้องเริ่มถีบขาเองได้",
        "• น้องสามารถดำน้ำท่า DOUBLE MOVING SWIM ได้โดยไม่สำลัก"
      ] },
      "Toddler3 (T3)": { title: "Toddler3 (T3)", detail: [
        "• น้องทำ Safe Jump (Ready Splash) ได้ด้วยตัวเอง",
        "• น้องเริ่มถีบขาเองได้",
        "• น้องสามารถดำน้ำท่า DOUBLE MOVING SWIM ได้โดยไม่สำลัก"
      ] },
      "Pre-School (PS)": { title: "Pre-School (PS)", detail: [
        "• น้องทำ Safe Jump (Ready Splash) ได้ด้วยตัวเอง",
        "• น้องเริ่มถีบขาเองได้",
        "• น้องสามารถดำน้ำท่า DOUBLE MOVING SWIM ได้โดยไม่สำลัก"
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
    detail: "Experience the joy of music at Playsound Chiang Mai, the premier music school dedicated to nurturing your child's musical talents from an early age!",
    description: {
      "Piano": { title: "Piano", detail: ["Introduction to Piano", "Piano Skills"] },
      "Guitar": { title: "Guitar", detail: ["Basic Guitar", "Guitar Skills"] },
      "Drum": { title: "Drum", detail: ["Beginner Drum techniques", "Drum Skills"] },
      "Sing": { title: "Sing", detail: ["Basic Singing", "Sing Skills"] },
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
        <div>
                    <ScrollLink
                      aria-current="page"
                      id="aquakids"
                    >
                      AquaKids
                    </ScrollLink>
                    <ScrollLink
                      aria-current="page"
                      id="playsound"
                    >
                      PlaySound
                    </ScrollLink>
                    <ScrollLink
                      aria-current="page"
                      id="address"
                    >
                      Address
                    </ScrollLink>
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
