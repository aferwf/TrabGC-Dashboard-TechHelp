import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, TicketCheck, Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import KPICard from '@/components/KPICard';
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import SatisfactionChart from '@/components/SatisfactionChart';
import DataTable from '@/components/DataTable';
import Filters from '@/components/Filters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  fetchTicketsData,
  calculateKPIs,
  getAgentProductivity,
  getTicketsByReason,
  getSatisfactionMetrics,
  TicketData,
} from '@/utils/fetchData';

const Index = () => {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTicketsData,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  useEffect(() => {
    if (!tickets) return;

    let filtered = [...tickets];

    if (selectedAgent !== 'all') {
      filtered = filtered.filter(t => t.agenteResponsavel === selectedAgent);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => 
        t.status.toLowerCase() === selectedStatus.toLowerCase() ||
        (selectedStatus === 'encerrado' && t.status.toLowerCase() === 'fechado')
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, selectedAgent, selectedStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Erro ao carregar dados. Verifique se a planilha está acessível e tente novamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const kpis = calculateKPIs(filteredTickets);
  const agentProductivity = getAgentProductivity(filteredTickets);
  const ticketsByReason = getTicketsByReason(filteredTickets);
  const satisfactionMetrics = getSatisfactionMetrics(filteredTickets);
  const allAgents = tickets 
    ? [...new Set(tickets.map(t => t.agenteResponsavel))].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filters */}
        <Filters
          agents={allAgents}
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title="Total de Chamados"
            value={kpis.total}
            icon={TicketCheck}
          />
          <KPICard
            title="Chamados Abertos"
            value={kpis.abertos}
            icon={AlertCircle}
          />
          <KPICard
            title="Chamados Encerrados"
            value={kpis.encerrados}
            icon={TrendingUp}
          />
          <KPICard
            title="Tempo Médio de Resposta"
            value={`${kpis.tempoMedio} min`}
            icon={Clock}
          />
          <KPICard
            title="Técnico Mais Produtivo"
            value={kpis.tecnicoMaisProdutivo}
            icon={Users}
            description="Mais chamados encerrados"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={agentProductivity.slice(0, 10)}
            title="Chamados por Técnico"
          />
          <PieChart
            data={ticketsByReason.slice(0, 5)}
            title="Distribuição por Motivo"
          />
        </div>

        {/* Satisfaction Chart */}
        <SatisfactionChart
          data={satisfactionMetrics.distribution}
          average={satisfactionMetrics.average}
          total={satisfactionMetrics.total}
        />

        {/* Data Table */}
        <DataTable tickets={filteredTickets} />
      </main>
    </div>
  );
};

export default Index;
