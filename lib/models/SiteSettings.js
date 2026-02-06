import { getDatabase } from '../mongodb';

export class SiteSettings {
  static collectionName = 'site_settings';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async get(key) {
    const collection = await this.getCollection();
    const setting = await collection.findOne({ key });
    return setting?.value;
  }

  static async set(key, value) {
    const collection = await this.getCollection();
    await collection.updateOne(
      { key },
      { $set: { key, value, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  }

  static async getAll() {
    const collection = await this.getCollection();
    const settings = await collection.find({}).toArray();
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
  }

  // Default settings
  static async initializeDefaults() {
    const defaults = {
      moderateRatings: true,
      totalAttendeesManual: 25000,
      showDesiPassEvents: true,
      showEventbriteEvents: true,
      // Site stats - displayed on homepage
      eventsOrganized: 50,
      happyAttendees: 25000,
      citiesCovered: 8
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.get(key);
      if (existing === undefined) {
        await this.set(key, value);
      }
    }
  }
}
