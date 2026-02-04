import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Order {
  static collectionName = 'orders';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(orderData) {
    const collection = await this.getCollection();
    const order = {
      id: uuidv4(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await collection.insertOne(order);
    return order;
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  static async findByOrderId(orderId) {
    const collection = await this.getCollection();
    return await collection.findOne({ orderId });
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    return await collection.find({ email }).sort({ createdAt: -1 }).toArray();
  }

  static async findByEventId(eventId) {
    const collection = await this.getCollection();
    return await collection.find({ eventId }).sort({ createdAt: -1 }).toArray();
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  static async getAll(filters = {}) {
    const collection = await this.getCollection();
    return await collection.find(filters).sort({ createdAt: -1 }).toArray();
  }
}
