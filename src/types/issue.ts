// @/types/issue.ts

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export type Issue = {
  issue_id: string;
  reservation_id?: string;
  title: string;
  description?: string;
  status: IssueStatus;
  resolved_by?: string;
  created_at: string;
  image?: string; // URL base64 ou undefined
  // Champs complémentaires injectés côté mock ou API pour affichage :
  rental_name?: string;
  res_name?: string;
};