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
                  {siteConfig.name}<br />
                  [Complete Legal Name]<br />
                  [Street Address]<br />
                  [Postal Code City]<br />
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
                  [Name of Managing Director]<br />
                  [Position]
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Register Entry</h2>
                <p className="text-muted-foreground">
                  Register Court: [Court Name]<br />
                  Register Number: [Registration Number]<br />
                  VAT ID: [VAT Identification Number]
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Responsible for Content</h2>
                <p className="text-muted-foreground">
                  [Name]<br />
                  [Address]
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This is a placeholder Impressum. Please fill in your complete legal information as required by German law (TMG § 5).
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
