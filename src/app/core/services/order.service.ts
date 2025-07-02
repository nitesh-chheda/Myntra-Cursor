import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order.model';
import { orders } from '../../data/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor() {}

  getOrders(): Observable<Order[]> {
    return of(orders);
  }

  getOrderById(id: number): Observable<Order | undefined> {
    return of(orders.find(order => order.id === id));
  }

  updateOrderStatus(id: number, status: Order['status']): Observable<Order | undefined> {
    const order = orders.find(order => order.id === id);
    if (order) {
      order.status = status;
    }
    return of(order);
  }

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    const newOrder: Order = {
      ...order,
      id: Math.max(...orders.map(o => o.id)) + 1
    };
    orders.push(newOrder);
    return of(newOrder);
  }
} 