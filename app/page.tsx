import classes from "./page.module.css"
import ImageBackground from "@/components/images/imageBackground";
import Card from "@/components/InfoCard/info-card";

import aquakidsLogo from "@/assets/logo.png";
import playsoundLogo from "@/assets/logo2.png";
import artplayLogo from "@/assets/logo3.png";
import taekwondoLogo from "@/assets/logo4.png";
import AQImg1 from "@/assets/aquaKids/1.jpg";
import AQImg2 from "@/assets/aquaKids/2.jpg";
import AQImg3 from "@/assets/aquaKids/3.jpg";
import AQImg4 from "@/assets/aquaKids/4.jpg";
import PSImg1 from "@/assets/playsound/1.jpg";
import PSImg2 from "@/assets/playsound/2.jpg";
import PSImg3 from "@/assets/playsound/3.jpg";
import PSImg4 from "@/assets/playsound/4.jpg";
import APImg1 from "@/assets/artplay/1.jpg";
import APImg2 from "@/assets/artplay/2.jpg";
import APImg3 from "@/assets/artplay/3.jpg";
import APImg4 from "@/assets/artplay/4.jpg";
import TKImg1 from "@/assets/taekwondo/1.jpg";
import TKImg2 from "@/assets/taekwondo/2.jpg";
import TKImg3 from "@/assets/taekwondo/3.jpg";
import TKImg4 from "@/assets/taekwondo/4.jpg";
import MapComponent from "@/components/map/map";
import ScrollLink from "@/components/scrollLink/scrollLink";
import Link from "next/link";

export default function Home() {

const aquakidsData = {
  title: "AquaKids",
  intro: "Auqa Kids Chiangmai is a swimming development school for children from newborns to those aged 10 years, featuring a curriculum developed in the UK. Our facility includes an indoor pool with a filtration and disinfection system using saltwater, which prevents irritation to the eyes, unlike chlorine. Children can comfortably open their eyes underwater, as the saltwater has a concentration similar to that of tears. Additionally, the saltwater system helps nourish children's skin. Our pool is heated to international standards, ensuring that children feel relaxed and safe while learning. Our curriculum is designed to foster both physical and mental development, focusing not only on swimming skills but also on building self-confidence, water safety skills, and a love for exercise from an early age. Children will learn in a fun and welcoming environment, guided by experienced instructors who provide attentive care at every step. If you are looking for a safe and high-quality place for your child to start their swimming journey, Auqa Kids Chiangmai is the perfect choice for your family!",
  detail: "At Aquakids Chiang Mai, we provide swimming classes designed for babies and young children, focusing on water safety, essential swimming techniques, and building confidence in the water.",
  description: {
      "What We Offer": { title: "What We Offer", detail: [
        "• Baby & Toddler Swimming Lessons: Start your little one’s water journey early!",
        "• Water Safety Skills: Learn breath control, submersion, floating, and more.",
        "• Fun & Engaging Classes: We use songs, games, and water toys to make learning enjoyable.",
        "• Boost Physical & Emotional Development: Swimming helps your child grow strong and confident.",
      ] },
"Why Choose AquaKids Chiang Mai?": { title: "Why Choose AquaKids Chiang Mai?", detail: [
        "• Experienced Instructors: Skilled teachers who are passionate about helping children thrive in the water.",
        "• Positive Learning Environment: Fun, engaging, and educational lessons tailored to each child’s pace.",
        "• Safe & Supportive: Ensuring your child’s safety and comfort is our top priority."
      ] },
  },
  logo: aquakidsLogo,
  previewImage: [
      AQImg3.src,
      AQImg4.src,
      AQImg2.src,
      AQImg1.src,
  ]
};
  
const playsoundData = {
    title: "PlaySound",
    detail: "At PlaySound Chiang Mai, we offer engaging and fun music lessons that introduce children to the world of music. From piano to drums, our expert instructors nurture young talents and inspire a love for music.",
    description: {
      "What We Offer": { title: "What We Offer", detail: [
        "• Piano & Keyboard Lessons: Perfect for young beginners and advancing musicians.",
        "• Drum Classes: For children who love rhythm and percussion.",
        "• Guitar Lessons: Learn to play acoustic or electric guitar with fun and engaging lessons.",
        "• Vocal Lessons: Build vocal skills and confidence in singing.",
      ] },
      "Why Choose PlaySound Chiang Mai?": { title: "Why Choose PlaySound Chiang Mai?", detail: [
        "• Experienced Instructors: Our skilled teachers are passionate about helping kids develop their musical abilities.",
        "• Engaging Classes: We make learning music fun with interactive lessons tailored to your child’s pace.",
        "• Broad Range of Instruments: From piano to drums, violin, guitar, and more, there’s something for every young musician.",
        "• Music for All Ages: Classes are available for children as young as 3 years old and beyond.",
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

const artplayData = {
    title: "ArtPlay",
    detail: "Join Teacher Darin at Aquakids Chiang Mai for Aquakids ArtPlay wonderful opportunity for your child to develop their creativity through hands-on clay sculpting.",
    description: {
      "What We Teach": { title: "What We Teach", detail: [
        "• Clay Sculpting for Kids: Our courses focus on helping children develop their fine motor skills and creativity through fun and engaging hands-on activities.",
        "• 3D Sculpting: From basic 3D projects to more advanced designs, children will explore the world of three-dimensional art.",
        "• Creative Workshops: Kids can dive into exciting 2D and 3D workshops, creating everything from simple shapes to more intricate box designs.",
      ] },
      "Why Aquakids ArtPlay?": { title: "Why Aquakids ArtPlay?", detail: [
        "• Expert Instruction: Teacher Darin, with years of experience, provides personal and dedicated teaching, nurturing each child’s artistic abilities.",
        "• Skill Development: Our courses help improve creativity, hand-eye coordination, and problem-solving skills in a fun and supportive environment.",
        "• Engaging Learning Experience: Children are encouraged to express themselves freely and confidently through their artwork.",
      ] },
  },
    logo: artplayLogo,
    previewImage: [
      APImg1.src,
      APImg2.src,
      APImg3.src,
      APImg4.src
    ]
};

const taekwondoData = {
    title: "Taekwondo",
    detail: "Now’s the perfect time to join our Taekwondo classes at Aquakids Chiang Mai! Get your child started on a journey of self-discipline, strength, and confidence.",
    description: {
      "Why Taekwondo at Aquakids?": { title: "Why Taekwondo at Aquakids?", detail: [
        "• Leadership Skills: Teach your child how to be a strong, confident leader.",
        "• Discipline and Focus: Build self-discipline and mental strength.",
        "• Physical Fitness: Boost strength, flexibility, and coordination.",
        "• Self-Confidence: Empower your child with confidence in themselves.",
        "• Self-Defense: Learn practical and valuable self-defense techniques.",
      ] },
      "What We Offer": { title: "What We Offer", detail: [
        "• Air-conditioned Training Rooms: Comfortable and cool environment for focused learning.",
        "• PM2.5 Air Filtration: Clean and safe air during classes.",
        "• Top-Quality Training Equipment: All gear meets high standards.",
      ] },
  },
    logo: taekwondoLogo,
    previewImage: [
      TKImg1.src,
      TKImg2.src,
      TKImg3.src,
      TKImg4.src
    ]
};

  return (
    <>
      <div className={classes.containerImage}>
        <span className={classes.text}>AquaCube</span>
        <div className={classes.subText}>Webprovider for Aquakids Chiang Mai</div>
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
                      id="artplay"
                    >
                      ArtPlay
                    </ScrollLink>
        </div>
        <div className={classes.button}>
                    <ScrollLink
                      aria-current="page"
                      id="taekwondo"
                    >
                      Taekwondo
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
      <div className={classes.container} id="artplay">
        <Card 
                  title={artplayData.title} 
                  detail={artplayData.detail} 
                  description={artplayData.description} 
                  logo={artplayData.logo.src} 
                  previewImage={artplayData.previewImage}/>
      </div>
      <div className={classes.container} id="taekwondo">
        <Card 
                  title={taekwondoData.title} 
                  detail={taekwondoData.detail} 
                  description={taekwondoData.description} 
                  logo={taekwondoData.logo.src} 
                  previewImage={taekwondoData.previewImage}/>
      </div>
      <div className={classes.container} id="address">
        <MapComponent />
      </div>
    </>
);
}
