import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Testimonial {
  static collectionName = 'testimonials';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(testimonialData) {
    const collection = await this.getCollection();
    
    // Only accept 5-star ratings
    if (testimonialData.rating !== 5) {
      throw new Error('Only 5-star ratings are accepted');
    }

    const testimonial = {
      id: uuidv4(),
      name: testimonialData.name,
      email: testimonialData.email,
      eventAttended: testimonialData.eventAttended,
      rating: 5, // Always 5 stars
      testimonial: testimonialData.testimonial,
      city: testimonialData.city || '',
      approved: false, // Requires moderation by default
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(testimonial);
    return testimonial;
  }

  static async findAll(options = {}) {
    const collection = await this.getCollection();
    const query = {};
    
    // By default, only show approved testimonials
    if (options.approvedOnly !== false) {
      query.approved = true;
    }
    
    return await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(options.limit || 100)
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  static async approve(id) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { approved: true, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async reject(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async getAverageRating() {
    const collection = await this.getCollection();
    const result = await collection.aggregate([
      { $match: { approved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]).toArray();
    
    if (result.length > 0) {
      return { averageRating: result[0].avgRating, totalRatings: result[0].count };
    }
    return { averageRating: 5.0, totalRatings: 0 };
  }

  static async getRecentApproved(limit = 6) {
    const collection = await this.getCollection();
    return await collection
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}
