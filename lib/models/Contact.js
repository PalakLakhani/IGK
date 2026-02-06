import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Contact {
  static collectionName = 'contacts';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(contactData) {
    const collection = await this.getCollection();
    const contact = {
      id: uuidv4(),
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      subject: contactData.subject || '',
      message: contactData.message,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(contact);
    return contact;
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  static async markRead(id, read = true) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { read, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
