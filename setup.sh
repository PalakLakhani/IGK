#!/bin/bash

# IGK Events - Quick Setup Script

echo "🎉 IGK Events - Setup Script"
echo "================================"
echo ""

# Check if MongoDB is running
echo "✓ Checking MongoDB connection..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✓ API is responding"
else
    echo "❌ API not responding. Make sure the server is running (yarn dev)"
    exit 1
fi

# Seed events
echo ""
echo "📦 Seeding sample events..."
SEED_RESULT=$(curl -s http://localhost:3000/api/seed-events)
echo "$SEED_RESULT"

# Show current events
echo ""
echo "📅 Current events in database:"
curl -s 'http://localhost:3000/api/events' | python3 -c "
import sys, json
data = json.load(sys.stdin)
for event in data.get('events', []):
    print(f\"  • {event['title']} - {event['city']} ({event['date'][:10]})\")
" 2>/dev/null || echo "  (Unable to parse events)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📱 Access your site:"
echo "   Frontend: http://localhost:3000"
echo "   Admin:    http://localhost:3000/admin (password: admin123)"
echo ""
echo "📖 Next steps:"
echo "   1. Update event dates in /app/lib/seed-events.js if needed"
echo "   2. Configure Stripe keys in .env when ready"
echo "   3. Add email service credentials"
echo "   4. Customize brand settings in /app/config/site.js"
echo ""
