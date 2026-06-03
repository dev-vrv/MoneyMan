import { apiClient } from "@/lib/api/client";

export type WorkspaceOverview = {
  user: {
    email: string;
    phone: string;
    display_name: string;
  };
  summary: {
    net_worth: string;
    monthly_income: string;
    monthly_expenses: string;
    savings_rate: number;
    scheduled_outflow: string;
    attention_count: number;
  };
  accounts: Array<{
    id: number;
    name: string;
    kind: string;
    institution: string;
    currency: string;
    balance: string;
    color_token: string;
  }>;
  budgets: Array<{
    id: number;
    category: string;
    spent: string;
    limit: string;
    utilization_percent: number;
    remaining: string;
    alert_threshold: number;
  }>;
  transactions: Array<{
    id: number;
    title: string;
    merchant: string;
    amount: string;
    status: string;
    category: string;
    account: string;
    transaction_date: string;
    note: string;
  }>;
  widgets: Array<{
    title: string;
    value: string;
    description: string;
  }>;
};

export async function fetchWorkspaceOverview() {
  const { data } = await apiClient.get<WorkspaceOverview>("/workspace/overview/");
  return data;
}
