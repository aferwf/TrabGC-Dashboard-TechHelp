import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { name: string; count: number }[];
  title: string;
}

const PieChart = ({ data, title }: PieChartProps) => {
  const colors = [
    'hsl(234, 75%, 59%)',
    'hsl(234, 60%, 70%)',
    'hsl(234, 50%, 75%)',
    'hsl(210, 65%, 65%)',
    'hsl(195, 60%, 65%)',
  ];

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: 'hsl(0, 0%, 100%)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          color: 'hsl(234, 15%, 50%)',
          usePointStyle: true,
          pointStyle: 'circle',
        },
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
  };

  return (
    <Card className="card-gradient shadow-card hover:shadow-card-hover transition-smooth">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <div className="h-80">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </Card>
  );
};

export default PieChart;
