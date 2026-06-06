"use client";

import { RiAddLine, RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";

import type { UiCopy } from "@/components/workspace/finance-workspace.types";
import { EmptyState } from "@/components/workspace/finance-workspace-ui";
import {
  formatDate,
  formatMoney,
  statusTone,
  transactionDisplayTitle,
  transactionSignedValue,
  transactionStatusLabel,
  transactionTypeLabel,
} from "@/components/workspace/finance-workspace.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionRecord } from "@/lib/api/finance";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type WorkspaceTransactionsSectionProps = {
  ui: UiCopy;
  content: Dictionary["workspace"];
  transactions: TransactionRecord[];
  onOpenTransactionDialog: () => void;
  onOpenTransactionEditDialog: (transaction: TransactionRecord) => void;
  onDeleteTransactionRequest: (transaction: TransactionRecord) => void;
};

export function WorkspaceTransactionsSection({
  ui,
  content,
  transactions,
  onOpenTransactionDialog,
  onOpenTransactionEditDialog,
  onDeleteTransactionRequest,
}: WorkspaceTransactionsSectionProps) {
  return (
    <Card className="surface-panel rounded-[2rem] border-white/8 bg-white/[0.04] py-0">
      <CardHeader className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">{ui.transactions}</CardTitle>
            <CardDescription className="text-zinc-400">{ui.manageTransactions}</CardDescription>
          </div>
          <Button className="rounded-2xl bg-emerald-300 text-slate-950" onClick={onOpenTransactionDialog}>
            <RiAddLine className="size-4" />
            {content.actions.addTransaction}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {transactions.length === 0 ? <EmptyState text={ui.emptyTransactions} /> : null}
        {transactions.length > 0 ? (
          <Table className="text-zinc-200">
            <TableHeader>
              <TableRow className="border-white/8 hover:bg-transparent">
                <TableHead>{content.table.title}</TableHead>
                <TableHead>{ui.type}</TableHead>
                <TableHead>{ui.category}</TableHead>
                <TableHead>{ui.status}</TableHead>
                <TableHead>{ui.date}</TableHead>
                <TableHead className="text-right">{ui.amount}</TableHead>
                <TableHead className="text-right">{ui.tools}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const signedValue = transactionSignedValue(transaction);

                return (
                  <TableRow key={transaction.id} className="border-white/8 hover:bg-white/[0.03]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{transactionDisplayTitle(transaction, ui)}</div>
                        <div className="text-xs text-zinc-500">{transaction.account_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{transactionTypeLabel(transaction.type, ui)}</TableCell>
                    <TableCell>{transaction.category_name || ui.transferLabel}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-full ${statusTone(transaction.status)}`}>
                        {transactionStatusLabel(transaction.status, ui)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.occurred_on)}</TableCell>
                    <TableCell className={`text-right font-medium ${signedValue.startsWith("-") ? "text-rose-300" : "text-emerald-300"}`}>
                      {formatMoney(signedValue, transaction.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" className="text-zinc-300 hover:text-white" onClick={() => onOpenTransactionEditDialog(transaction)}>
                          <RiPencilLine className="size-4" />
                        </Button>
                        <Button variant="ghost" className="text-zinc-300 hover:text-white" onClick={() => onDeleteTransactionRequest(transaction)}>
                          <RiDeleteBin6Line className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
