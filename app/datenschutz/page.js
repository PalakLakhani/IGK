import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Datenschutzerklärung</h1>
          <p className="text-muted-foreground mb-8">
            <strong>IGK Indo-German Konnekt UG (haftungsbeschränkt)</strong><br />
            Stand: 27.02.2026
          </p>
          
          <Card>
            <CardContent className="p-8 space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Verantwortlicher</h2>
                <p className="text-muted-foreground">
                  IGK Indo-German Konnekt UG (haftungsbeschränkt)<br />
                  Friesenstraße 10<br />
                  06112 Halle (Saale)<br />
                  Deutschland
                </p>
                <p className="text-muted-foreground mt-4">
                  E-Mail: <Link href="mailto:igkonnekt@gmail.com" className="text-primary hover:underline">igkonnekt@gmail.com</Link>
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">2. Hosting der Website</h2>
                <p className="text-muted-foreground mb-4">
                  Unsere Website wird über <strong>Netlify</strong> betrieben.
                </p>
                <p className="text-muted-foreground mb-2">
                  Beim Aufruf der Website werden automatisch folgende Daten verarbeitet:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>IP-Adresse</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>Browsertyp</li>
                  <li>Betriebssystem</li>
                  <li>Referrer-URL</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Diese Daten sind technisch erforderlich, um die Website bereitzustellen.
                </p>
                <p className="text-muted-foreground">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">3. Datenbank (Newsletter)</h2>
                <p className="text-muted-foreground mb-4">
                  Zur Speicherung von Newsletter-E-Mail-Adressen verwenden wir <strong>MongoDB Atlas</strong> in der Region Frankfurt (AWS).
                </p>
                <p className="text-muted-foreground mb-2">
                  Verarbeitet wird ausschließlich:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>E-Mail-Adresse</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                </p>
                <p className="text-muted-foreground">
                  Die Speicherung erfolgt in Rechenzentren innerhalb der EU (Frankfurt Region).
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">4. Website-Analyse mit Umami (Cloud)</h2>
                <p className="text-muted-foreground mb-4">
                  Wir verwenden die Cloud-Version von Umami zur anonymisierten Website-Analyse.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Keine Cookies</li>
                  <li>Keine Nutzerprofile</li>
                  <li>Keine Weitergabe oder Verkauf von Daten</li>
                  <li>Keine personalisierte Nachverfolgung</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Erfasst werden ausschließlich aggregierte statistische Daten (z. B. Seitenaufrufe, Besucheranzahl).
                </p>
                <p className="text-muted-foreground">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">5. Speicherung von Bildern und Videos</h2>
                <p className="text-muted-foreground mb-4">
                  Zur Speicherung von Bildern und Videos nutzen wir <strong>Cloudinary</strong>.
                </p>
                <p className="text-muted-foreground mb-4">
                  Es werden ausschließlich Medieninhalte verarbeitet, die für die Darstellung unserer Veranstaltungen erforderlich sind.
                </p>
                <p className="text-muted-foreground mb-2">
                  Veröffentlichungen erfolgen:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO)</li>
                  <li>oder auf Grundlage einer Einwilligung</li>
                </ul>
                <p className="text-muted-foreground">
                  Betroffene Personen können jederzeit die Löschung verlangen.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">6. Weiterleitung zu Ticketplattformen</h2>
                <p className="text-muted-foreground mb-2">
                  Unsere Website enthält Links zu externen Plattformen wie:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Eventbrite</li>
                  <li>DesiPass</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Beim Anklicken verlassen Sie unsere Website.
                </p>
                <p className="text-muted-foreground">
                  Die Verarbeitung personenbezogener Daten erfolgt dort eigenverantwortlich durch die jeweiligen Betreiber.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">7. Newsletter</h2>
                <p className="text-muted-foreground mb-2">
                  Wenn Sie sich für unseren Newsletter anmelden, verarbeiten wir:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Ihre E-Mail-Adresse</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Die Anmeldung ist freiwillig.
                </p>
                <p className="text-muted-foreground mb-4">
                  Sie können Ihre Einwilligung jederzeit widerrufen.
                </p>
                <p className="text-muted-foreground">
                  Es erfolgt keine Weitergabe oder kommerzielle Nutzung der Daten.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">8. Ihre Rechte</h2>
                <p className="text-muted-foreground mb-2">
                  Sie haben folgende Rechte gemäß DSGVO:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Auskunft</li>
                  <li>Berichtigung</li>
                  <li>Löschung</li>
                  <li>Einschränkung der Verarbeitung</li>
                  <li>Datenübertragbarkeit</li>
                  <li>Widerspruch</li>
                </ul>
                <p className="text-muted-foreground">
                  Beschwerderecht bei einer Aufsichtsbehörde bleibt unberührt.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">9. Speicherdauer</h2>
                <p className="text-muted-foreground mb-2">
                  Daten werden nur so lange gespeichert, wie:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>der Zweck besteht</li>
                  <li>gesetzliche Aufbewahrungspflichten greifen</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">10. SSL-Verschlüsselung</h2>
                <p className="text-muted-foreground">
                  Die Website nutzt SSL-Verschlüsselung zur sicheren Datenübertragung.
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
