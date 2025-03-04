// components/Profile.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Users } from "lucide-react";

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

interface UserProfile {
  username: string;
  image: string;
  contacts: Contact[];
  kids: Kid[];
}

interface ProfileProps {
  userProfile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ userProfile }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 ring-2 ring-blue-500 ring-offset-2">
            <AvatarImage src={userProfile.image} alt={userProfile.username} />
            <AvatarFallback className="bg-blue-500 text-white text-2xl">
              {userProfile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{userProfile.username}</h3>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Contact List</h4>
          <ul className="space-y-2">
            {userProfile.contacts.map((contact) => (
              <li key={contact.id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow">
                <User className="h-4 w-4 text-blue-500" />
                <span>
                  {contact.name} - {contact.phone}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Kids</h4>
          <ul className="space-y-2">
            {userProfile.kids.map((kid) => (
              <li key={kid.id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow">
                <Users className="h-4 w-4 text-purple-500" />
                <span>
                  {kid.name} - {kid.age} years old
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;

