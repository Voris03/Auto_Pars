export interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: string;
  body: string;
  engine: string;
  modification: string;
  price: number;
  images?: string[];
  specifications?: {
    model?: string;
    year?: string;
    engine?: string;
    body?: string;
    modification?: string;
  };
}