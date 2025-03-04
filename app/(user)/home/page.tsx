"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Courses from "@/components/userComponent/Courses";
import Certifications from "@/components/userComponent/Certifications";
import Profile from "@/components/userComponent/Profile";
import defaultImg from "@/assets/logo.png"

interface Course {
  id: number;
  title: string;
  description: string;
  quota: number;
  completed: number;
  color: string;
}

interface Certification {
  id: number;
  title: string;
  description: string;
  completed: boolean; // Ensure this matches your data structure
}

interface Contact {
  id: number;
  name: string;
  phone: string;
}

interface Kid {
  id: number;
  name: string;
  age: number;
}

interface Child {
  id: number;
  name: string;
  courses: Course[];
}

interface UserProfile {
  username: string;
  image: string;
  contacts: Contact[];
  kids: Kid[];
}

const UserDashboard = () => {
  
   const childrenData: Child[] = [
     {
       id: 1,
       name: "Tommy",
       courses: [
         {
           id: 1,
           title: "Toddler Swimming Course",
           description:
             "Age-Appropriate Classes focusing on water safety and swimming techniques.",
           quota: 10,
           completed: 7,
           color: "bg-blue-500",
         },
         {
           id: 2,
           title: "Piano Course",
           description:
             "Learn to play the piano with our comprehensive course designed for beginners.",
           quota: 10,
           completed: 5,
           color: "bg-purple-500",
         },
       ],
     },
     {
       id: 2,
       name: "Lucy",
       courses: [
         {
           id: 3,
           title: "Guitar Course",
           description:
             "Master the guitar with our step-by-step lessons covering various styles.",
           quota: 8,
           completed: 3,
           color: "bg-green-500",
         },
         {
           id: 4,
           title: "Art Class",
           description:
             "Explore creativity through various art techniques and mediums.",
           quota: 6,
           completed: 2,
           color:"bg-red-500"
         },
       ],
     },
   ];

   const certifications : Certification[] = [
     {
       id :1 ,
       title :"Toddler Swimming Course" ,
       description :"Successfully completed the full program of water safety and swimming techniques." ,
       completed :true ,
     },
     {
       id :2 ,
       title :"Piano Fundamentals" ,
       description :"Mastered the basics of piano playing and music theory." ,
       completed :true ,
     },
   ];

   const userProfile = {
    username: "john_doe",
    image: defaultImg.src, // Use .src to get the string URL of the image
    contacts: [
      { id: 1, name: "Alice", phone: "123-456-7890" },
      { id: 2, name: "Bob", phone: "9876543210" },
    ],
    kids: [
      { id: 1, name: "Tommy", age: 8 },
      { id: 2, name: "Lucy", age: 5 },
    ],
  };
  

   return (
     <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
       <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

       {/* Tabs for navigation */}
       <Tabs defaultValue="courses" className="space-y-4">
         {/* Tab List */}
         <TabsList className="bg-white shadow-md rounded-lg">
           {/* Tab Triggers */}
           <TabsTrigger value="courses">Courses</TabsTrigger> 
           <TabsTrigger value="certifications">Certifications</TabsTrigger> 
           <TabsTrigger value="profile">Profile</TabsTrigger> 
         </TabsList>

         {/* Tab Contents */}
         <TabsContent value="courses" className="space-y-4">
           <Courses children={childrenData} /> {/* Pass childrenData to Courses */}
         </TabsContent>

         <TabsContent value="certifications" className="space-y-4">
           <Certifications certifications={certifications} />
         </TabsContent>

         <TabsContent value="profile">
           <Profile userProfile={userProfile} />
         </TabsContent>
       </Tabs>
     </div>
   );
};

export default UserDashboard;

