import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Define the shape of the data being passed to the component
interface CourseData {
  month: string;
  courses: number;
}

interface NewCoursesBarChartProps {
  data: CourseData[];
}

const NewCoursesBarChart: React.FC<NewCoursesBarChartProps> = ({ data }) => {
  return (
    <Card className="h-[400px] bg-white">
      <CardHeader>
        <CardTitle>New Courses Sold per Month</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="courses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NewCoursesBarChart;
