import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Data Protection at a Glance</h2>
                <h3 className="font-semibold mb-2">General Information</h3>
                <p className="text-muted-foreground mb-4">
                  The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to identify you personally.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">2. Data Collection on This Website</h2>
                <h3 className="font-semibold mb-2">Who is responsible for data collection?</h3>
                <p className="text-muted-foreground mb-4">
                  Data processing on this website is carried out by the website operator. You can find their contact details in the Impressum.
                </p>
                
                <h3 className="font-semibold mb-2">How do we collect your data?</h3>
                <p className="text-muted-foreground mb-4">
                  Your data is collected when you provide it to us (e.g., when purchasing tickets, subscribing to newsletter, or contacting us). Other data is collected automatically by our IT systems when you visit the website (e.g., browser type, operating system).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">3. Ticket Purchase & Event Attendance</h2>
                <p className="text-muted-foreground mb-4">
                  When you purchase tickets, we collect: name, email address, payment information. This data is used for order processing, ticket delivery, and event management. We use secure payment processors (Stripe) for handling payment information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Receive information about your stored data</li>
                  <li>Request correction of incorrect data</li>
                  <li>Request deletion of your data</li>
                  <li>Request restriction of data processing</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  This website uses cookies to improve user experience. You can configure your browser to reject cookies or notify you when cookies are being sent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Newsletter</h2>
                <p className="text-muted-foreground mb-4">
                  If you subscribe to our newsletter, we collect your email address. You can unsubscribe at any time by clicking the unsubscribe link in any newsletter.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
                <p className="text-muted-foreground mb-4">
                  For data protection inquiries, please contact:<br />
                  Email: {siteConfig.contact.email}
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This is a simplified Datenschutzerklärung placeholder. Please consult with a legal expert to create a comprehensive privacy policy compliant with GDPR and German data protection laws.
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
