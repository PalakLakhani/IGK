import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Company Information</h2>
                <p className="text-muted-foreground">
                  IGK Indo-German Konnekt UG (haftungsbeschränkt)<br />
                  Friesenstraße 10<br />
                  06112 Halle (Saale)<br />
                  Germany
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <p className="text-muted-foreground">
                  Email: {siteConfig.contact.email}<br />
                  Phone: {siteConfig.contact.phone}<br />
                  WhatsApp: {siteConfig.contact.whatsapp}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Authorized Representative</h2>
                <p className="text-muted-foreground">
                  Palak Kamlesh Lakhani<br />
                  Founder & CEO
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Register Entry</h2>
                <p className="text-muted-foreground">
                  Register Court: Amtsgericht Charlottenburg<br />
                  Register Number: HRB 259840 B<br />
                  VAT ID: DE365404336
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Responsible for Content</h2>
                <p className="text-muted-foreground">
                  Palak Kamlesh Lakhani<br />
                  Friesenstraße 10<br />
                  06112 Halle (Saale)<br />
                  Germany
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
