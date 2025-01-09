import PieChart from "@/components/graph/pieChart";
import StaticGraph from "@/components/graph/staticGraph";

export default function dashboardAdmin(){
    return (<>
    <div>
        <StaticGraph />
        <PieChart />
        
    </div>
    </>)
}