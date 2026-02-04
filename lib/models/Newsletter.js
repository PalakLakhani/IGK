import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Newsletter {
  static collectionName = 'newsletter_subscribers';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async subscribe(email) {
    const collection = await this.getCollection();
    
    // Check if already subscribed
    const existing = await collection.findOne({ email });
    if (existing) {
      return { success: false, message: 'Email already subscribed' };
    }

    const subscriber = {
      id: uuidv4(),
      email,
      subscribedAt: new Date(),
      active: true
    };

    await collection.insertOne(subscriber);
    return { success: true, subscriber };
  }

  static async unsubscribe(email) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { email },
      { $set: { active: false, unsubscribedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async getAll() {
    const collection = await this.getCollection();
    return await collection.find({ active: true }).sort({ subscribedAt: -1 }).toArray();
  }
}
