// components/Certifications.tsx
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText } from "lucide-react";

interface Certification {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface CertificationsProps {
  certifications: Certification[];
}

const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <Card key={cert.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>{cert.title}</CardTitle>
            <CardDescription>{cert.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Completed</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
              <FileText className="mr-2 h-4 w-4" /> View Certificate
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Certifications;
