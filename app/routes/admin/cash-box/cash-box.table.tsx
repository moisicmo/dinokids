import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronRight, Lock, LockOpen, User } from 'lucide-react';
import type { CashBoxSessionDetailModel, CashBoxSessionItemModel } from '@/models';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CashBoxSessionDetail } from './cash-box.session-detail';

const COLSPAN = 8;

const fmt = (date: string | null) => date ? format(new Date(date), 'dd-MMM-yyyy HH:mm', { locale: es }) : '—';

interface Props {
  sessions: CashBoxSessionItemModel[];
  expandedId: string | null;
  detailsById: Record<string, CashBoxSessionDetailModel>;
  loadingId: string | null;
  onToggleRow: (id: string) => void;
}

export const CashBoxTable = (props: Props) => {
  const { sessions, expandedId, detailsById, loadingId, onToggleRow } = props;

  return (
    <Table className="mb-3">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>Apertura</TableHead>
          <TableHead>Cierre</TableHead>
          <TableHead>Cajero</TableHead>
          <TableHead className="text-right">Efectivo inicial</TableHead>
          <TableHead className="text-right">Total cobrado</TableHead>
          <TableHead className="text-right">Efectivo en caja</TableHead>
          <TableHead className="text-center">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.length === 0 && (
          <TableRow>
            <TableCell colSpan={COLSPAN} className="text-center text-muted-foreground py-10">
              Sin registros
            </TableCell>
          </TableRow>
        )}
        {sessions.map((s) => {
          const isExpanded = expandedId === s.id;
          const totalSales = s.totalSales.cash + s.totalSales.bank + s.totalSales.qr;
          return (
            <React.Fragment key={s.id}>
              <TableRow onClick={() => onToggleRow(s.id)} className="cursor-pointer">
                <TableCell>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </TableCell>
                <TableCell>{fmt(s.openedAt)}</TableCell>
                <TableCell>{fmt(s.closedAt)}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {s.staffName}
                  </span>
                </TableCell>
                <TableCell className="text-right">Bs. {s.initialAmount.toFixed(2)}</TableCell>
                <TableCell className="text-right text-secondary font-semibold">Bs. {totalSales.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">Bs. {s.expectedCash.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  {s.closedAt
                    ? <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><Lock className="w-3.5 h-3.5" />Cerrada</span>
                    : <span className="inline-flex items-center gap-1 text-secondary text-xs"><LockOpen className="w-3.5 h-3.5" />Abierta</span>}
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={COLSPAN} className="p-0 bg-muted/20">
                    <div className="rounded-md border border-border bg-card m-3 p-4 shadow-sm">
                      {loadingId === s.id && (
                        <p className="text-muted-foreground text-sm text-center py-8">Cargando...</p>
                      )}
                      {loadingId !== s.id && detailsById[s.id] && (
                        <CashBoxSessionDetail detail={detailsById[s.id]} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};
