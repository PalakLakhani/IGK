import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class Testimonial {
  static collectionName = 'testimonials';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  // Rate limiting: Check if email has submitted recently
  static async checkRateLimit(email) {
    const collection = await this.getCollection();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentSubmission = await collection.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: oneHourAgo }
    });
    
    return !!recentSubmission;
  }

  static async create(testimonialData) {
    const collection = await this.getCollection();
    
    // Validate rating (1-5 stars)
    const rating = parseInt(testimonialData.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars');
    }

    // Check honeypot field (spam control)
    if (testimonialData.website && testimonialData.website.trim() !== '') {
      throw new Error('Spam detected');
    }

    // Rate limiting
    const isRateLimited = await this.checkRateLimit(testimonialData.email);
    if (isRateLimited) {
      throw new Error('You can only submit one review per hour. Please try again later.');
    }

    const testimonial = {
      id: uuidv4(),
      name: testimonialData.name.trim(),
      email: testimonialData.email.toLowerCase().trim(),
      eventAttended: testimonialData.eventAttended,
      rating: rating,
      testimonial: testimonialData.testimonial.trim(),
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
    
    if (result.length > 0 && result[0].count > 0) {
      // Round to 1 decimal place
      const avgRating = Math.round(result[0].avgRating * 10) / 10;
      return { averageRating: avgRating, totalRatings: result[0].count };
    }
    // Default to 5.0 if no reviews yet
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

  // Get rating distribution for admin
  static async getRatingDistribution() {
    const collection = await this.getCollection();
    const result = await collection.aggregate([
      { $match: { approved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]).toArray();
    
    // Format as { 5: count, 4: count, ... }
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    result.forEach(r => {
      distribution[r._id] = r.count;
    });
    return distribution;
  }
}
