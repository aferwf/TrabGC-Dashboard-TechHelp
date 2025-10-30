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
import { SmilePlus } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SatisfactionChartProps {
  data: { name: string; count: number }[];
  average: number;
  total: number;
}

const SatisfactionChart = ({ data, average, total }: SatisfactionChartProps) => {
  const colors = [
    'hsl(234, 75%, 59%)', // Azul escuro para Muito Satisfeito
    'hsl(234, 65%, 65%)', // Azul médio para Satisfeito
    'hsl(234, 55%, 72%)', // Azul claro para Neutro
    'hsl(234, 45%, 78%)', // Azul muito claro para Insatisfeito
    'hsl(234, 35%, 83%)', // Azul claríssimo para Muito Insatisfeito
  ];

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Quantidade',
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(color => color.replace(')', ', 0.8)')),
        borderWidth: 2,
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
          precision: 0,
        },
        grid: {
          color: 'hsl(234, 15%, 90%)',
        },
      },
      x: {
        ticks: {
          color: 'hsl(234, 15%, 50%)',
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const getSatisfactionEmoji = (avg: number) => {
    if (avg >= 4.5) return '😊';
    if (avg >= 3.5) return '🙂';
    if (avg >= 2.5) return '😐';
    if (avg >= 1.5) return '😕';
    return '😞';
  };

  return (
    <Card className="card-gradient shadow-card hover:shadow-card-hover transition-smooth">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <SmilePlus className="h-5 w-5 text-primary" />
            Satisfação dos Clientes
          </h3>
          <div className="text-right">
            <div className="text-3xl mb-1">{getSatisfactionEmoji(average)}</div>
            <div className="text-2xl font-bold text-primary">{average.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">{total} avaliações</div>
          </div>
        </div>
        <div className="h-64">
          {data.length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhuma avaliação disponível
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SatisfactionChart;
