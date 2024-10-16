export interface IAchievement {
  id: number;
  header: string;
  open_date: string | null;
  description: string;
  count: number;
  progress: number;
  key: string;
  picture: string;
}
