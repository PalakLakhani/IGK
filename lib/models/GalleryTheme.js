import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class GalleryTheme {
  static collectionName = 'gallery_themes';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  static async create(themeData) {
    const collection = await this.getCollection();
    const slug = themeData.slug || this.generateSlug(themeData.name);
    
    // Check for duplicate slug
    const existing = await collection.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const theme = {
      id: uuidv4(),
      name: themeData.name,
      slug: finalSlug,
      coverImageUrl: themeData.coverImageUrl || '',
      description: themeData.description || '',
      order: themeData.order || 0,
      status: themeData.status || 'draft', // 'published' or 'draft'
      photoCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(theme);
    return theme;
  }

  static async getAll() {
    const collection = await this.getCollection();
    return collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
  }

  static async getPublished() {
    const collection = await this.getCollection();
    return collection.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).toArray();
  }

  static async getById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ id });
  }

  static async getBySlug(slug) {
    const collection = await this.getCollection();
    return collection.findOne({ slug, status: 'published' });
  }

  static async update(id, updateData) {
    const collection = await this.getCollection();
    
    // If name changed, update slug
    if (updateData.name) {
      const existing = await collection.findOne({ id });
      if (existing && existing.name !== updateData.name) {
        updateData.slug = this.generateSlug(updateData.name);
        // Check for duplicate
        const duplicate = await collection.findOne({ slug: updateData.slug, id: { $ne: id } });
        if (duplicate) {
          updateData.slug = `${updateData.slug}-${Date.now()}`;
        }
      }
    }

    const result = await collection.updateOne(
      { id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async updatePhotoCount(id, count) {
    const collection = await this.getCollection();
    await collection.updateOne(
      { id },
      { $set: { photoCount: count, updatedAt: new Date() } }
    );
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}
