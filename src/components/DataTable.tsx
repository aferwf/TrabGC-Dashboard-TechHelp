import { useState } from 'react';
import { TicketData } from '@/utils/fetchData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface DataTableProps {
  tickets: TicketData[];
}

const DataTable = ({ tickets }: DataTableProps) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY = 5;
  
  const displayedTickets = showAll ? tickets : tickets.slice(0, INITIAL_DISPLAY);
  const hasMore = tickets.length > INITIAL_DISPLAY;

  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'aberto') return 'destructive';
    if (statusLower === 'encerrado' || statusLower === 'fechado') return 'default';
    return 'secondary';
  };

  const getPriorityVariant = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    if (priorityLower === 'alta' || priorityLower === 'high') return 'destructive';
    if (priorityLower === 'média' || priorityLower === 'medium') return 'secondary';
    return 'outline';
  };

  const formatSatisfaction = (value: number) => {
    if (value >= 4) return '😊';
    if (value >= 3) return '😐';
    return '😞';
  };

  return (
    <Card className="card-gradient shadow-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Todos os Chamados
        </h3>
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Prioridade</TableHead>
                <TableHead className="font-semibold">Motivo</TableHead>
                <TableHead className="font-semibold">Agente</TableHead>
                <TableHead className="font-semibold">Departamento</TableHead>
                <TableHead className="font-semibold text-right">FRT (min)</TableHead>
                <TableHead className="font-semibold text-center">Satisfação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum chamado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                displayedTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id}
                    className="hover:bg-accent/50 transition-smooth cursor-pointer"
                  >
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(ticket.prioridade)}>
                        {ticket.prioridade}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{ticket.motivo}</TableCell>
                    <TableCell>{ticket.agenteResponsavel}</TableCell>
                    <TableCell>{ticket.departamento}</TableCell>
                    <TableCell className="text-right">{ticket.frt || '-'}</TableCell>
                    <TableCell className="text-center text-lg">
                      {ticket.satisfacao > 0 ? formatSatisfaction(ticket.satisfacao) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {hasMore && !showAll && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="w-full sm:w-auto"
            >
              Ver mais ({tickets.length - INITIAL_DISPLAY} chamados restantes)
            </Button>
          </div>
        )}
        {showAll && hasMore && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(false)}
              className="w-full sm:w-auto"
            >
              Ver menos
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DataTable;
