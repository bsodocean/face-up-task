export interface Alert {
  id: number;
  name: string;
  age: number;
  description: string;
  file?: string | File | null;
}
