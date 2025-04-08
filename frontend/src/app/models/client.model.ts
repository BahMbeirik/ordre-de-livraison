export interface Client {
  id?: number;
  name: string;
  tel: string;
  address1: {
    latitude: number;
    longitude: number;
  };
  address2: string;
}