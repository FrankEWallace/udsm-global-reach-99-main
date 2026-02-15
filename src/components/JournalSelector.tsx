/**
 * JournalSelector Component
 * Dropdown to select individual journal or view aggregated stats
 */

import { OJSContext } from '@/services/ojsApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Layers } from 'lucide-react';

interface JournalSelectorProps {
  contexts: OJSContext[];
  selectedJournalId: number | null;
  onJournalChange: (journalId: number | null) => void;
  isLoading?: boolean;
}

export function JournalSelector({
  contexts,
  selectedJournalId,
  onJournalChange,
  isLoading = false,
}: JournalSelectorProps) {
  const getContextName = (ctx: OJSContext) => {
    // Get English name or first available
    return ctx.name?.en || ctx.name?.['en_US'] || Object.values(ctx.name)[0] || ctx.urlPath;
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        View Statistics:
      </label>
      <Select
        value={selectedJournalId?.toString() || 'all'}
        onValueChange={(value) => onJournalChange(value === 'all' ? null : parseInt(value, 10))}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[320px] max-w-[400px] bg-white border-slate-200">
          <SelectValue placeholder="Select journal..." className="truncate" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-udsm-navy flex-shrink-0" />
              <span className="font-medium">All Journals (Aggregated)</span>
            </div>
          </SelectItem>
          {contexts.map((ctx) => (
            <SelectItem key={ctx.id} value={ctx.id.toString()}>
              <div className="flex items-center gap-2 max-w-[350px]">
                <Building2 className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <span className="truncate">{getContextName(ctx)}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">({ctx.urlPath})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {contexts.length > 1 && (
        <span className="text-xs text-muted-foreground">
          {contexts.length} journals available
        </span>
      )}
    </div>
  );
}
