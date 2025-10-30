import Papa from 'papaparse';

export interface TicketData {
  id: string;
  dataAbertura: string;
  dataFechamento: string;
  status: string;
  prioridade: string;
  motivo: string;
  solucao: string;
  solicitante: string;
  agenteResponsavel: string;
  departamento: string;
  tma: number;
  frt: number;
  satisfacao: number;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1J3rxGubyBXMKfg2YPgNh-ajnhRNoBCft/export?format=csv';

// Converte valores textuais de satisfação para numéricos
const convertSatisfactionToNumber = (value: string): number => {
  const normalized = value.trim().toLowerCase();
  const satisfactionMap: Record<string, number> = {
    'excelente': 5,
    'muito bom': 5,
    'ótimo': 5,
    'bom': 4,
    'médio': 3,
    'regular': 2,
    'ruim': 1,
    'péssimo': 1,
  };
  
  return satisfactionMap[normalized] || parseFloat(value) || 0;
};

export const fetchTicketsData = async (): Promise<TicketData[]> => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any) => {
            const satisfacaoValue = row['Satisfação do Cliente'] || row['satisfacao'] || '0';
            
            return {
              id: row['ID do Chamado'] || row['id'] || '',
              dataAbertura: row['Data de Abertura'] || row['dataAbertura'] || '',
              dataFechamento: row['Data de Fechamento'] || row['dataFechamento'] || '',
              status: row['Status'] || row['status'] || '',
              prioridade: row['Prioridade'] || row['prioridade'] || '',
              motivo: row['Motivo'] || row['motivo'] || '',
              solucao: row['Solução'] || row['solucao'] || '',
              solicitante: row['Solicitante'] || row['solicitante'] || '',
              agenteResponsavel: row['Agente Responsável'] || row['agenteResponsavel'] || '',
              departamento: row['Departamento'] || row['departamento'] || '',
              tma: parseFloat(row['TMA (minutos)'] || row['tma'] || '0'),
              frt: parseFloat(row['FRT (minutos)'] || row['frt'] || '0'),
              satisfacao: convertSatisfactionToNumber(satisfacaoValue),
            };
          });
          
          console.log('Dados carregados:', data.length, 'tickets');
          console.log('Exemplo de satisfação:', data.slice(0, 3).map(d => ({ id: d.id, satisfacao: d.satisfacao })));
          
          resolve(data as TicketData[]);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export const calculateKPIs = (tickets: TicketData[]) => {
  const total = tickets.length;
  const abertos = tickets.filter(t => t.status.toLowerCase() === 'aberto').length;
  const encerrados = tickets.filter(t => t.status.toLowerCase() === 'encerrado' || t.status.toLowerCase() === 'fechado').length;
  
  const frtValues = tickets.filter(t => t.frt > 0).map(t => t.frt);
  const tempoMedio = frtValues.length > 0 
    ? Math.round(frtValues.reduce((a, b) => a + b, 0) / frtValues.length)
    : 0;

  const agenteCounts = tickets
    .filter(t => t.status.toLowerCase() === 'encerrado' || t.status.toLowerCase() === 'fechado')
    .reduce((acc, ticket) => {
      acc[ticket.agenteResponsavel] = (acc[ticket.agenteResponsavel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const tecnicoMaisProdutivo = Object.entries(agenteCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  return {
    total,
    abertos,
    encerrados,
    tempoMedio,
    tecnicoMaisProdutivo,
  };
};

export const getAgentProductivity = (tickets: TicketData[]) => {
  const agentCounts = tickets.reduce((acc, ticket) => {
    const agent = ticket.agenteResponsavel || 'Não atribuído';
    acc[agent] = (acc[agent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(agentCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getTicketsByReason = (tickets: TicketData[]) => {
  const reasonCounts = tickets.reduce((acc, ticket) => {
    const reason = ticket.motivo || 'Não especificado';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(reasonCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getSatisfactionMetrics = (tickets: TicketData[]) => {
  const ticketsWithSatisfaction = tickets.filter(t => t.satisfacao > 0);
  
  if (ticketsWithSatisfaction.length === 0) {
    return {
      average: 0,
      distribution: [],
      total: 0,
    };
  }

  const distribution = [
    { name: 'Muito Satisfeito (5)', count: ticketsWithSatisfaction.filter(t => t.satisfacao === 5).length },
    { name: 'Satisfeito (4)', count: ticketsWithSatisfaction.filter(t => t.satisfacao === 4).length },
    { name: 'Neutro (3)', count: ticketsWithSatisfaction.filter(t => t.satisfacao === 3).length },
    { name: 'Insatisfeito (2)', count: ticketsWithSatisfaction.filter(t => t.satisfacao === 2).length },
    { name: 'Muito Insatisfeito (1)', count: ticketsWithSatisfaction.filter(t => t.satisfacao === 1).length },
  ];

  const average = ticketsWithSatisfaction.reduce((sum, t) => sum + t.satisfacao, 0) / ticketsWithSatisfaction.length;

  return {
    average: Math.round(average * 10) / 10,
    distribution: distribution.filter(d => d.count > 0),
    total: ticketsWithSatisfaction.length,
  };
};
