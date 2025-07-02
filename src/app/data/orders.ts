import { Order } from '../core/models/order.model';

export const orders: Order[] = [
  {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    orderDate: new Date('2024-03-15'),
    total: 299.99,
    status: 'delivered',
    items: [
      {
        productId: 1,
        productName: 'Classic White T-Shirt',
        quantity: 2,
        price: 29.99,
        total: 59.98
      },
      {
        productId: 2,
        productName: 'Slim Fit Jeans',
        quantity: 1,
        price: 79.99,
        total: 79.99
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    orderDate: new Date('2024-03-16'),
    total: 159.98,
    status: 'processing',
    items: [
      {
        productId: 3,
        productName: 'Summer Dress',
        quantity: 1,
        price: 89.99,
        total: 89.99
      }
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    paymentMethod: 'PayPal'
  }
]; 