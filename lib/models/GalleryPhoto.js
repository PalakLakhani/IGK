import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';
import { GalleryTheme } from './GalleryTheme';

export class GalleryPhoto {
  static collectionName = 'gallery_photos';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(photoData) {
    const collection = await this.getCollection();
    const photo = {
      id: uuidv4(),
      themeId: photoData.themeId,
      imageUrl: photoData.imageUrl,
      caption: photoData.caption || '',
      order: photoData.order || 0,
      isCover: photoData.isCover || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(photo);
    
    // Update theme photo count
    await this.updateThemePhotoCount(photoData.themeId);

    return photo;
  }

  static async bulkCreate(themeId, photos) {
    const collection = await this.getCollection();
    const photoDocs = photos.map((p, index) => ({
      id: uuidv4(),
      themeId,
      imageUrl: p.imageUrl,
      caption: p.caption || '',
      order: p.order || index,
      isCover: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (photoDocs.length > 0) {
      await collection.insertMany(photoDocs);
      await this.updateThemePhotoCount(themeId);
    }

    return photoDocs;
  }

  static async getByThemeId(themeId) {
    const collection = await this.getCollection();
    return collection.find({ themeId }).sort({ order: 1, createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  static async update(id, updateData) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async setAsCover(id, themeId) {
    const collection = await this.getCollection();
    
    // Remove cover from all photos in theme
    await collection.updateMany(
      { themeId },
      { $set: { isCover: false } }
    );
    
    // Set this photo as cover
    await collection.updateOne(
      { id },
      { $set: { isCover: true, updatedAt: new Date() } }
    );
  }

  static async reorder(themeId, photoIds) {
    const collection = await this.getCollection();
    
    for (let i = 0; i < photoIds.length; i++) {
      await collection.updateOne(
        { id: photoIds[i], themeId },
        { $set: { order: i, updatedAt: new Date() } }
      );
    }
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const photo = await collection.findOne({ id });
    
    if (!photo) return false;

    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount > 0) {
      await this.updateThemePhotoCount(photo.themeId);
      return true;
    }
    return false;
  }

  static async deleteByThemeId(themeId) {
    const collection = await this.getCollection();
    await collection.deleteMany({ themeId });
  }

  static async updateThemePhotoCount(themeId) {
    const collection = await this.getCollection();
    const count = await collection.countDocuments({ themeId });
    await GalleryTheme.updatePhotoCount(themeId, count);
  }
}
