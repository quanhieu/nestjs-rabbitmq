import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  public orders: any[] = [];
  constructor() {
    this.orders = [];
  }

  async handleOrderPlacedEvent(order: any) {
    console.log(`Received a new order - customer: ${order?.email}`);
    this.orders.push(order);
  }

  getOrders() {
    return this.orders;
  }
}
