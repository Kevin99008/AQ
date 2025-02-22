import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentData {
    month: string;
    students: number;
}

interface NewStudentsBarChartProps {
    data: StudentData[];
}

const NewStudentsBarChart = ({ data }: NewStudentsBarChartProps) => {
    return (
        <Card className="h-[400px] bg-white">
            <CardHeader>
                <CardTitle>New Students per Month</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default NewStudentsBarChart;
