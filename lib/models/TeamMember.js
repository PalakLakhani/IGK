import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';

export class TeamMember {
  static collectionName = 'team_members';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async create(memberData) {
    const collection = await this.getCollection();
    
    const member = {
      id: uuidv4(),
      name: memberData.name,
      designation: memberData.designation || memberData.role,
      role: memberData.role || memberData.designation,
      image: memberData.image || '',
      linkedin: memberData.linkedin || '',
      instagram: memberData.instagram || '',
      bio: memberData.bio || '',
      city: memberData.city || '',
      type: memberData.type || 'city', // 'leadership' or 'city'
      order: memberData.order || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(member);
    return member;
  }

  static async findAll(options = {}) {
    const collection = await this.getCollection();
    const query = { isActive: true };
    
    if (options.type) {
      query.type = options.type;
    }
    
    if (options.city) {
      query.city = options.city;
    }
    
    return await collection
      .find(query)
      .sort({ order: 1, createdAt: 1 })
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
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
    // Soft delete
    const result = await collection.updateOne(
      { id },
      { $set: { isActive: false, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async hardDelete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  static async getLeadershipTeam() {
    return await this.findAll({ type: 'leadership' });
  }

  static async getCityTeam(city) {
    return await this.findAll({ type: 'city', city });
  }

  static async getAllCityTeams() {
    const collection = await this.getCollection();
    const members = await collection
      .find({ isActive: true, type: 'city' })
      .sort({ city: 1, order: 1 })
      .toArray();
    
    // Group by city
    const grouped = {};
    members.forEach(member => {
      const city = member.city?.toLowerCase() || 'other';
      if (!grouped[city]) grouped[city] = [];
      grouped[city].push(member);
    });
    
    return grouped;
  }

  static async seedDefaultTeam() {
    const collection = await this.getCollection();
    const count = await collection.countDocuments();
    
    if (count > 0) return { message: 'Team already seeded', count };

    // Leadership team
    const leadershipTeam = [
      { name: 'Rajesh Kumar', designation: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Visionary leader with 10+ years in event management', type: 'leadership', order: 1 },
      { name: 'Priya Sharma', designation: 'Co-Founder & COO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Operations expert passionate about cultural events', type: 'leadership', order: 2 },
      { name: 'Amit Patel', designation: 'Head of Marketing', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Creative marketer driving brand growth', type: 'leadership', order: 3 },
      { name: 'Sneha Reddy', designation: 'Head of Events', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', bio: 'Event production specialist with eye for detail', type: 'leadership', order: 4 }
    ];

    // City teams
    const cityTeams = [
      { name: 'Rahul Kapoor', role: 'City Lead', city: 'Berlin', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop', type: 'city', order: 1 },
      { name: 'Neha Das', role: 'Event Coordinator', city: 'Berlin', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop', type: 'city', order: 2 },
      { name: 'Deepak Malhotra', role: 'City Lead', city: 'Munich', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop', type: 'city', order: 1 },
      { name: 'Pooja Agarwal', role: 'Event Coordinator', city: 'Munich', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop', type: 'city', order: 2 },
      { name: 'Suresh Krishnan', role: 'City Lead', city: 'Frankfurt', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', type: 'city', order: 1 },
      { name: 'Shreya Bhat', role: 'Event Coordinator', city: 'Frankfurt', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop', type: 'city', order: 2 }
    ];

    const allMembers = [...leadershipTeam, ...cityTeams];
    
    for (const member of allMembers) {
      await this.create(member);
    }

    return { message: 'Team seeded successfully', count: allMembers.length };
  }
}
