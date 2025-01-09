'use client'

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import classes from './graph.module.css'

// Register necessary components with ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function PieChart() {
  // Mock-up data for the pie chart
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3], // Example data
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
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
        text: 'Votes Distribution',
      },
    },
    // You can add more options if needed
    // For example:
    // cutout: '50%', // For a doughnut chart
    // animations: { ... }
  };

  return (
    <div className={classes.card}> {/* Set desired width and height */}
      <Pie data={data} options={options} />
    </div>
  );
}
