import PieChart from "@/components/graph/pieChart";
import StaticGraph from "@/components/graph/staticGraph";
import classes from './page.module.css'
export default function dashboardAdmin(){
    return (<main className={classes.container}>
        <div >
            <StaticGraph />
            <PieChart />
        </div>
    </main>)
}