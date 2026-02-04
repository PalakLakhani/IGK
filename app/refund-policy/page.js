import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-semibold">
                  Please read this policy carefully before purchasing tickets. All sales are final unless specified below.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">General Policy</h2>
                <p className="text-muted-foreground">
                  All ticket purchases are final and non-refundable. We do not offer refunds for change of plans, inability to attend, or any personal circumstances.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Event Cancellation by Organizer</h2>
                <p className="text-muted-foreground mb-4">
                  If we cancel an event, you are entitled to a full refund including any booking fees. Refunds will be processed within 7-14 business days to the original payment method.
                </p>
                <p className="text-muted-foreground">
                  We will notify all ticket holders via email and announce on our social media channels.
                </p>
              </div>

              <div>
                <h2 className text-xl font-semibold mb-3">Event Postponement</h2>
                <p className="text-muted-foreground mb-4">
                  If an event is postponed to a new date:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Your ticket remains valid for the new date</li>
                  <li>If you cannot attend the new date, you may request a refund within 7 days of postponement announcement</li>
                  <li>Alternatively, you can transfer your ticket to another person</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Ticket Transfer</h2>
                <p className="text-muted-foreground mb-4">
                  If you cannot attend, you may transfer your ticket to someone else:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Contact us at {siteConfig.contact.email} with your order details</li>
                  <li>Provide the new attendee's name and email</li>
                  <li>We will update the ticket (processing may take 1-2 business days)</li>
                  <li>No transfer fee applies</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Exceptional Circumstances</h2>
                <p className="text-muted-foreground mb-4">
                  Refunds may be considered in exceptional circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Serious illness or medical emergency (medical certificate required)</li>
                  <li>Family bereavement (death certificate required)</li>
                  <li>Travel restrictions beyond your control</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Such requests must be submitted in writing to {siteConfig.contact.email} with supporting documentation. Approval is at our discretion.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">No Show Policy</h2>
                <p className="text-muted-foreground">
                  If you do not attend the event, no refund will be issued. Please ensure you can attend before purchasing.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Payment Processor Fees</h2>
                <p className="text-muted-foreground">
                  In cases where refunds are approved, payment processing fees (typically 2-3%) are non-refundable and will be deducted from the refund amount.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
                <p className="text-muted-foreground mb-4">
                  For eligible refund requests:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Email: {siteConfig.contact.email}</li>
                  <li>Subject: "Refund Request - [Order ID]"</li>
                  <li>Include: Order ID, reason, supporting documents (if applicable)</li>
                  <li>We will respond within 3-5 business days</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
                <p className="text-muted-foreground">
                  Questions about this policy?<br />
                  Email: {siteConfig.contact.email}<br />
                  WhatsApp: {siteConfig.contact.whatsapp}
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  This policy is effective as of {new Date().toLocaleDateString('en-GB')} and may be updated at any time. By purchasing tickets, you agree to the current refund policy.
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
