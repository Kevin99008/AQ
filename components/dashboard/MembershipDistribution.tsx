import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PieChartData } from "@/types/dashboard";

interface MembershipDistributionProps {
  data: PieChartData[];
}

export default function MembershipDistribution({ data }: MembershipDistributionProps) {
  // Predefined HEX color codes for the pie chart segments
  const COLORS = [
    "#36A2EB", // Blue
    "#FF9F40", // Orange
  ];

  // Calculate percentages for the summary
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentages = data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: Math.round((item.value / total) * 100),
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              innerRadius={30}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => {
                if (value === null || value === undefined || total === null || total === undefined) {
                  return [`${value}`, name];
                }
                return [
                  `${Number(value)} (${Math.round((Number(value) / Number(total)) * 100)}%)`,
                  name,
                ];
              }}
              contentStyle={{ borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-2">
        {percentages.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}</span>
            </div>
            <div className="font-medium">
              {item.value} ({item.percentage}%)
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
}
