import { getDatabase } from '../mongodb';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export class Ticket {
  static collectionName = 'tickets';

  static async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  static async generateQRCode(ticketCode) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(ticketCode);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }

  static async create(ticketData) {
    const collection = await this.getCollection();
    const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrCode = await this.generateQRCode(ticketCode);
    
    const ticket = {
      id: uuidv4(),
      ticketCode,
      qrCode,
      ...ticketData,
      isUsed: false,
      usedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await collection.insertOne(ticket);
    return ticket;
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ id });
  }

  static async findByTicketCode(ticketCode) {
    const collection = await this.getCollection();
    return await collection.findOne({ ticketCode });
  }

  static async findByOrderId(orderId) {
    const collection = await this.getCollection();
    return await collection.find({ orderId }).toArray();
  }

  static async findByEventId(eventId) {
    const collection = await this.getCollection();
    return await collection.find({ eventId }).toArray();
  }

  static async markAsUsed(ticketCode) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { ticketCode },
      { 
        $set: { 
          isUsed: true, 
          usedAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );
    return result.modifiedCount > 0;
  }

  static async update(id, updates) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  static async getStats(eventId) {
    const collection = await this.getCollection();
    const tickets = await collection.find({ eventId }).toArray();
    
    return {
      total: tickets.length,
      used: tickets.filter(t => t.isUsed).length,
      unused: tickets.filter(t => !t.isUsed).length
    };
  }
}
