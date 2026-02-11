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
                <h2 className="text-xl font-semibold mb-3">5. Website Analytics</h2>
                <p className="text-muted-foreground mb-4">
                  We use <strong>Umami Analytics</strong>, a privacy-focused analytics service, to understand how visitors use our website. Umami is designed to be compliant with GDPR, CCPA, and other privacy regulations.
                </p>
                <h3 className="font-semibold mb-2">What data is collected?</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                  <li>Page views and navigation patterns</li>
                  <li>Referral sources (how you found our site)</li>
                  <li>Device type (mobile/desktop)</li>
                  <li>Country/region (anonymized)</li>
                  <li>Browser type</li>
                </ul>
                <h3 className="font-semibold mb-2">Privacy Features</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>No cookies:</strong> Umami does not use cookies</li>
                  <li><strong>No personal data:</strong> We do not collect IP addresses or personal identifiers</li>
                  <li><strong>No cross-site tracking:</strong> Your activity is not tracked across websites</li>
                  <li><strong>GDPR compliant:</strong> No consent banner required due to privacy-first design</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  This website uses minimal cookies to improve user experience. Our analytics service (Umami) does not use cookies. Essential cookies may be used for basic functionality like remembering your preferences.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">7. Newsletter</h2>
                <p className="text-muted-foreground mb-4">
                  If you subscribe to our newsletter, we collect your email address. You can unsubscribe at any time by clicking the unsubscribe link in any newsletter.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
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
