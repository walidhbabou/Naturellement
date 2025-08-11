export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  stock?: number;
  image_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
