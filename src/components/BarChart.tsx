import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: { name: string; count: number }[];
  title: string;
}

const BarChart = ({ data, title }: BarChartProps) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Número de Chamados',
        data: data.map(item => item.count),
        backgroundColor: 'hsl(234, 75%, 59%)',
        borderColor: 'hsl(234, 75%, 59%)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(234, 30%, 25%)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'hsl(234, 15%, 50%)',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'hsl(234, 30%, 90%)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: 'hsl(234, 15%, 50%)',
          font: {
            size: 12,
          },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="card-gradient shadow-card hover:shadow-card-hover transition-smooth">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </Card>
  );
};

export default BarChart;
