import { Depot } from "./depot";

export interface Produit {
  id?: number;
  name: string;
  prix?: number;
  quantity: number;
  depot: Depot;
}

