import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Event {
  static collectionName = 'events';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(eventData) {
    const collection = await this.getCollection();
    const event = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await collection.insertOne(event);
    return event;
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  static async findBySlug(slug) {
    const collection = await this.getCollection();
    return await collection.findOne({ slug });
  }

  static async findAll(filters = {}) {
    const collection = await this.getCollection();
    const query = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.city) {
      query.city = filters.city;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    return await collection.find(query).sort({ date: 1 }).toArray();
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async getUpcoming(limit = 10) {
    const collection = await this.getCollection();
    return await collection
      .find({ date: { $gte: new Date() }, status: 'published' })
      .sort({ date: 1 })
      .limit(limit)
      .toArray();
  }

  static async getPast(limit = 10) {
    const collection = await this.getCollection();
    return await collection
      .find({ date: { $lt: new Date() }, status: 'published' })
      .sort({ date: -1 })
      .limit(limit)
      .toArray();
  }
}
