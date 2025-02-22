import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserMinus, GraduationCap } from "lucide-react";

interface StatisticsData {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newStudents: number;
}

interface StatisticsOverviewProps {
  lastMonthData: StatisticsData;
  thisMonthData: StatisticsData;
}

const calculateDifference = (previous: number, current: number) => {
  const difference = current - previous;
  const percentage = ((difference / previous) * 100).toFixed(1);
  return { difference, percentage };
};

export default function StatisticsOverview({ lastMonthData, thisMonthData }: StatisticsOverviewProps) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
      {Object.keys(lastMonthData).map((key) => {
        const previous = lastMonthData[key as keyof StatisticsData];
        const current = thisMonthData[key as keyof StatisticsData];
        const { difference, percentage } = calculateDifference(previous, current);
        const isPositive = difference >= 0;
        const icons = {
          totalMembers: <Users className="h-4 w-4 text-muted-foreground" />,
          activeMembers: <UserCheck className="h-4 w-4 text-muted-foreground" />,
          inactiveMembers: <UserMinus className="h-4 w-4 text-muted-foreground" />,
          newStudents: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
        };

        return (
          <Card key={key} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </CardTitle>
              {icons[key as keyof StatisticsData]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{current}</div>
              <p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "+" : ""}
                {percentage}% from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
