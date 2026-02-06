import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Gallery {
  static collectionName = 'gallery';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(photoData) {
    const collection = await this.getCollection();
    const photo = {
      id: uuidv4(),
      imageUrl: photoData.imageUrl,
      caption: photoData.caption || '',
      order: photoData.order || 0,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(photo);
    return photo;
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find({ active: true }).sort({ order: 1, createdAt: -1 }).toArray();
  }

  static async getAllAdmin() {
    const collection = await this.getCollection();
    return collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  static async update(id, updateData) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );
    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
