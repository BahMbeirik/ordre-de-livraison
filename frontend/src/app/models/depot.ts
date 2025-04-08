import { Produit } from './produit';
import { User } from './user.model';

export interface Depot {
  id?: number;
  name: string;
  chef: User;
}