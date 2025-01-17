'use client'

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import classes from './graph.module.css'

// Register the necessary components with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StaticGraph() {
  // Mock-up data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [300, 500, 400, 700, 200, 600],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Profit ($)',
        data: [100, 200, 150, 300, 50, 250],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Ensure TypeScript recognizes this as a valid literal type
      },
      title: {
        display: true,
        text: 'Monthly Sales and Profit Data',
      },
    },
  };

  return (
    <>
    <div className={classes.card}>
      <Bar data={data} options={options} />
    </div>
    </>
  )
}
