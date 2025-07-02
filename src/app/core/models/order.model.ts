export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
} 