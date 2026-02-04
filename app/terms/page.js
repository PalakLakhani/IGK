import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By purchasing tickets or attending our events, you agree to these Terms and Conditions. Please read them carefully before making a purchase.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. Ticket Purchase</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All ticket sales are final unless the event is cancelled</li>
                  <li>Tickets are personal and non-refundable</li>
                  <li>Tickets may be transferred to another person with proper notification</li>
                  <li>Lost or stolen tickets cannot be replaced</li>
                  <li>Ticket prices may vary based on early bird, regular, or VIP categories</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Event Attendance</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Valid photo ID required for entry (age verification)</li>
                  <li>Ticket must be presented as QR code (digital or printed)</li>
                  <li>One-time entry only; re-entry not permitted</li>
                  <li>We reserve the right to refuse entry without explanation</li>
                  <li>Attendees must follow venue rules and staff instructions</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Prohibited Items & Behavior</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>No outside food, drinks, or alcohol</li>
                  <li>No weapons, illegal substances, or dangerous items</li>
                  <li>No professional cameras or recording equipment</li>
                  <li>No disruptive, abusive, or illegal behavior</li>
                  <li>Violation may result in immediate removal without refund</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Event Changes & Cancellations</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Change event date, time, or venue (with notification)</li>
                  <li>Modify event lineup or schedule</li>
                  <li>Cancel event due to circumstances beyond our control</li>
                  <li>In case of cancellation, refunds will be issued as per our refund policy</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Photography & Media</h2>
                <p className="text-muted-foreground">
                  By attending, you consent to being photographed/filmed for promotional purposes. Photos/videos may be used on our website and social media.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Liability</h2>
                <p className="text-muted-foreground">
                  {siteConfig.name} is not liable for personal injury, loss, or damage to property during events. Attendees participate at their own risk.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms:<br />
                  Email: {siteConfig.contact.email}<br />
                  WhatsApp: {siteConfig.contact.whatsapp}
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Last Updated: {new Date().toLocaleDateString('en-GB')}<br />
                  These terms are subject to change. Continued use constitutes acceptance of updated terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
