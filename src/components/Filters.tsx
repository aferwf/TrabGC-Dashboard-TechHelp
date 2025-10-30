import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FiltersProps {
  agents: string[];
  selectedAgent: string;
  onAgentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const Filters = ({
  agents,
  selectedAgent,
  onAgentChange,
  selectedStatus,
  onStatusChange,
}: FiltersProps) => {
  return (
    <Card className="card-gradient shadow-card">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Técnico Responsável
            </label>
            <Select value={selectedAgent} onValueChange={onAgentChange}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Todos os técnicos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os técnicos</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Filters;
