import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="py-12 bg-muted/40">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            <strong>IGK Indo-German Konnekt UG (haftungsbeschränkt)</strong><br />
            Last Updated: 27.02.2026
          </p>
          
          <Card>
            <CardContent className="p-8 space-y-8">
              {/* Section 1 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">1. Scope of Application</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms of Service govern the use of the website operated by:
                </p>
                <p className="text-muted-foreground">
                  Indo-German Konnekt UG (haftungsbeschränkt)<br />
                  Friesenstraße 10<br />
                  06112 Halle (Saale)<br />
                  Germany<br />
                  Email: igkonnekt@gmail.com
                </p>
                <p className="text-muted-foreground mt-4">
                  By accessing or using this website, users agree to these Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">2. Nature of the Website</h2>
                <p className="text-muted-foreground mb-4">
                  The IGK website is an <strong>informational platform</strong> presenting cultural events, community activities, and collaborations organized or promoted by IGK.
                </p>
                <p className="text-muted-foreground mb-2">IGK:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Does <strong>not sell tickets directly</strong> via the website</li>
                  <li>Does <strong>not process payments</strong> through the website</li>
                  <li>Does <strong>not act as ticketing provider</strong></li>
                </ul>
                <p className="text-muted-foreground mb-2">
                  Ticket purchases are processed exclusively through third-party platforms such as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Eventbrite</li>
                  <li>DesiPass</li>
                </ul>
                <p className="text-muted-foreground mb-2">
                  When users click on ticket links, they are redirected to the respective external provider. Their terms, privacy policies, and refund rules apply.
                </p>
                <p className="text-muted-foreground">IGK is not responsible for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Payment processing</li>
                  <li>Ticket issuance</li>
                  <li>Refund handling</li>
                  <li>Technical errors on external platforms</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">3. External Links Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  This website may contain links to third-party websites, including ticketing providers and social media platforms.
                </p>
                <p className="text-muted-foreground mb-2">
                  IGK has no control over external content and assumes no liability for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Accuracy of information</li>
                  <li>Data processing practices</li>
                  <li>Security measures</li>
                  <li>Content updates</li>
                </ul>
                <p className="text-muted-foreground">
                  Use of third-party platforms is at the user's own responsibility.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">4. Event Information Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  Event details (date, venue, time, lineup, program, pricing category) are provided to the best of IGK's knowledge.
                </p>
                <p className="text-muted-foreground mb-2">IGK reserves the right to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Modify event schedules</li>
                  <li>Change venues</li>
                  <li>Adjust program details</li>
                  <li>Cancel events due to force majeure (e.g. weather, government restrictions, safety issues)</li>
                </ul>
                <p className="text-muted-foreground">
                  Binding contractual relationships for ticket holders are governed by the respective ticketing platform.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">5. Intellectual Property Rights</h2>
                <p className="text-muted-foreground mb-2">
                  All content on this website, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Logos</li>
                  <li>Graphics</li>
                  <li>Event posters</li>
                  <li>Text content</li>
                  <li>Branding materials</li>
                  <li>Website design</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  is protected under German copyright law (Urheberrechtsgesetz).
                </p>
                <p className="text-muted-foreground mb-4">
                  Unauthorized reproduction, distribution, modification, or commercial use without written consent of IGK is prohibited.
                </p>
                <p className="text-muted-foreground">
                  Instagram-embedded content remains subject to Instagram's platform terms.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">6. Newsletter Subscription & Data Processing</h2>
                
                <h3 className="font-semibold mt-4 mb-2">6.1 Data Collected</h3>
                <p className="text-muted-foreground mb-2">
                  The website collects <strong>only email addresses</strong> for voluntary newsletter subscription.
                </p>
                <p className="text-muted-foreground mb-2">No:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Payment data</li>
                  <li>Sensitive personal data</li>
                  <li>User accounts</li>
                  <li>Behavioral tracking beyond standard technical website logs</li>
                </ul>
                <p className="text-muted-foreground">are stored by IGK.</p>

                <h3 className="font-semibold mt-4 mb-2">6.2 Legal Basis</h3>
                <p className="text-muted-foreground mb-2">Processing is based on:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Article 6(1)(a) GDPR (Consent)</li>
                </ul>
                <p className="text-muted-foreground mb-2">Users may unsubscribe at any time via:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>The unsubscribe link in emails</li>
                  <li>Written request to <Link href="mailto:igkonnekt@gmail.com" className="text-primary hover:underline">igkonnekt@gmail.com</Link></li>
                </ul>

                <h3 className="font-semibold mt-4 mb-2">6.3 Data Storage</h3>
                <p className="text-muted-foreground mb-2">Email addresses are:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Stored securely</li>
                  <li>Not shared with third parties</li>
                  <li>Not sold</li>
                  <li>Not used for profiling</li>
                </ul>
                <p className="text-muted-foreground">
                  Further details are outlined in the separate <Link href="/datenschutz" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">7. Photography and Media Use</h2>
                <p className="text-muted-foreground mb-4">
                  IGK may publish selected event photos on the website.
                </p>
                <p className="text-muted-foreground mb-4">
                  Additional media content may be available via IGK's official Instagram account.
                </p>
                <p className="text-muted-foreground mb-4">
                  By attending IGK events, participants may be photographed or filmed for promotional purposes.
                </p>
                <p className="text-muted-foreground">
                  If an individual wishes to request removal of a photo published on the website, they may contact IGK directly.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-2">
                  Under applicable German law (§§ 276, 280 BGB), IGK is liable:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Without limitation in cases of intent or gross negligence</li>
                  <li>For injury to life, body, or health</li>
                  <li>Under mandatory statutory provisions</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  In cases of slight negligence, liability is limited to foreseeable, contract-typical damages.
                </p>
                <p className="text-muted-foreground mb-2">IGK is not liable for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>Loss of personal belongings at events</li>
                  <li>Injuries caused by third parties</li>
                  <li>Technical failures of external ticket platforms</li>
                  <li>Website downtime beyond reasonable control</li>
                </ul>
                <p className="text-muted-foreground">
                  Participation in events occurs at the attendee's own risk.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">9. No Warranty</h2>
                <p className="text-muted-foreground mb-2">
                  The website content is provided "as is." IGK does not guarantee:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Continuous availability</li>
                  <li>Error-free functionality</li>
                  <li>Complete accuracy of external information</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms are governed by the laws of the Federal Republic of Germany.
                </p>
                <p className="text-muted-foreground mb-4">
                  If the user is a consumer within the meaning of §13 BGB, mandatory consumer protection laws remain unaffected.
                </p>
                <p className="text-muted-foreground">
                  Place of jurisdiction, where legally permissible, is the registered seat of IGK in Germany.
                </p>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">11. Severability Clause</h2>
                <p className="text-muted-foreground">
                  If any provision of these Terms is or becomes invalid, the remaining provisions remain unaffected.
                </p>
              </div>

              {/* Section 12 */}
              <div>
                <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
                <p className="text-muted-foreground mb-2">
                  For legal inquiries regarding these Terms:
                </p>
                <p className="text-muted-foreground">
                  IGK Indo-German Konnekt UG (haftungsbeschränkt)<br />
                  <Link href="mailto:igkonnekt@gmail.com" className="text-primary hover:underline">igkonnekt@gmail.com</Link>
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
