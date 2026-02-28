import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'mediacoverage';

export const MediaCoverage = {
  async findAll(filters = {}) {
    const db = await getDatabase();
    const query = {};
    
    if (filters.type) {
      query.type = filters.type;
    }
    
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }
    
    const items = await db.collection(COLLECTION)
      .find(query)
      .sort({ order: 1, publishedDate: -1 })
      .toArray();
    
    return items;
  },

  async findById(id) {
    const db = await getDatabase();
    return await db.collection(COLLECTION).findOne({ id });
  },

  async getFeatured() {
    const db = await getDatabase();
    const items = await db.collection(COLLECTION)
      .find({ featured: true })
      .sort({ order: 1, publishedDate: -1 })
      .toArray();
    
    return items;
  },

  async create(data) {
    const db = await getDatabase();
    const item = {
      id: uuidv4(),
      type: data.type || 'newspaper', // newspaper, instagram, youtube, online
      title: data.title || '',
      description: data.description || '',
      quote: data.quote || '',
      publicationName: data.publicationName || '',
      publicationLogo: data.publicationLogo || '',
      coverImage: data.coverImage || '',
      articleUrl: data.articleUrl || '',
      embedUrl: data.embedUrl || '',
      publishedDate: data.publishedDate || new Date().toISOString(),
      featured: data.featured || false,
      order: data.order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection(COLLECTION).insertOne(item);
    return item;
  },

  async update(id, updates) {
    const db = await getDatabase();
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Remove id from updates to prevent modification
    delete updateData.id;

    await db.collection(COLLECTION).updateOne(
      { id },
      { $set: updateData }
    );

    return await this.findById(id);
  },

  async delete(id) {
    const db = await getDatabase();
    const result = await db.collection(COLLECTION).deleteOne({ id });
    return result.deletedCount > 0;
  },

  async getCount() {
    const db = await getDatabase();
    return await db.collection(COLLECTION).countDocuments();
  },

  async seedPlaceholders() {
    const db = await getDatabase();
    const count = await db.collection(COLLECTION).countDocuments();
    
    if (count > 0) {
      return { message: 'Media coverage already exists', count };
    }

    const placeholders = [
      // Newspaper articles
      {
        id: uuidv4(),
        type: 'newspaper',
        title: 'Indian Community Celebrates Diwali in Grand Style',
        description: 'The annual Diwali celebration organized by IGK brought together over 2,000 attendees in Frankfurt.',
        quote: '"A spectacular evening that brought the warmth of Indian traditions to Germany"',
        publicationName: 'Frankfurter Allgemeine',
        publicationLogo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=500&fit=crop',
        articleUrl: 'https://example.com/article1',
        publishedDate: '2024-11-15',
        featured: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'newspaper',
        title: 'Holi Festival Colors Munich Streets',
        description: 'Over 3,000 participants joined the vibrant Holi celebration making it one of the largest in Bavaria.',
        quote: '"Munich has never seen such a colorful celebration"',
        publicationName: 'Süddeutsche Zeitung',
        publicationLogo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1576398289164-c48dc021b4e1?w=800&h=500&fit=crop',
        articleUrl: 'https://example.com/article2',
        publishedDate: '2024-03-25',
        featured: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'newspaper',
        title: 'Bollywood Night Attracts Record Crowd',
        description: 'The biggest Bollywood DJ night in Germany saw participation from fans across multiple cities.',
        quote: '',
        publicationName: 'Der Spiegel',
        publicationLogo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',
        articleUrl: 'https://example.com/article3',
        publishedDate: '2024-08-10',
        featured: true,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Instagram features
      {
        id: uuidv4(),
        type: 'instagram',
        title: 'Event Highlights Reel',
        description: 'Featured on @bollywoodevents_germany with over 50K views',
        quote: '',
        publicationName: '@bollywoodevents_germany',
        publicationLogo: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=800&fit=crop',
        articleUrl: 'https://instagram.com/bollywoodevents_germany',
        embedUrl: '',
        publishedDate: '2024-10-20',
        featured: true,
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'instagram',
        title: 'Garba Night Coverage',
        description: 'Our Navratri celebration was featured on @indiansinfrankfurt',
        quote: '',
        publicationName: '@indiansinfrankfurt',
        publicationLogo: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=800&h=800&fit=crop',
        articleUrl: 'https://instagram.com/indiansinfrankfurt',
        embedUrl: '',
        publishedDate: '2024-10-05',
        featured: false,
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // YouTube features
      {
        id: uuidv4(),
        type: 'youtube',
        title: 'IGK Diwali 2024 Full Event Coverage',
        description: 'Complete coverage of our grand Diwali celebration - 2 hour special!',
        quote: '',
        publicationName: 'Desi Vibes Germany',
        publicationLogo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=450&fit=crop',
        articleUrl: 'https://youtube.com/watch?v=example1',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        publishedDate: '2024-11-18',
        featured: true,
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        type: 'youtube',
        title: 'Behind the Scenes - Holi Event',
        description: 'Go behind the scenes of our massive Holi celebration',
        quote: '',
        publicationName: 'Indian Events Europe',
        publicationLogo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=200&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1576398289164-c48dc021b4e1?w=800&h=450&fit=crop',
        articleUrl: 'https://youtube.com/watch?v=example2',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        publishedDate: '2024-03-28',
        featured: false,
        order: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Online article
      {
        id: uuidv4(),
        type: 'online',
        title: 'Best Indian Events in Germany 2024',
        description: 'IGK was featured in the top 10 Indian event organizers in Germany.',
        quote: '"IGK has revolutionized how Indian festivals are celebrated in Germany"',
        publicationName: 'ExpatFocus.com',
        publicationLogo: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=200&h=100&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
        articleUrl: 'https://example.com/best-indian-events',
        publishedDate: '2024-12-01',
        featured: true,
        order: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    await db.collection(COLLECTION).insertMany(placeholders);
    return { message: 'Placeholder media coverage seeded', count: placeholders.length };
  }
};
