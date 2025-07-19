export interface AdAccountProps {
  id: string;
  account_id: string;
  name: string;
  account_status: number; // 1 for active
  currency: string;
  timezone_name: string;
  spend_cap: string;
  amount_spent: string;
}
