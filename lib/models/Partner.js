import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Partner {
  static collectionName = 'partners';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(partnerData) {
    const collection = await this.getCollection();
    const partner = {
      id: uuidv4(),
      name: partnerData.name,
      email: partnerData.email,
      phone: partnerData.phone || '',
      company: partnerData.company || '',
      partnershipType: partnerData.partnershipType || '',
      message: partnerData.message,
      replied: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(partner);
    return partner;
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  static async markReplied(id, replied = true) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { replied, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
