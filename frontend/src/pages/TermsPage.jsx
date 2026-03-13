import { Link } from "react-router-dom";

const EFFECTIVE = "1 January 2025";
const EMAIL = "legal@refrll.com";

function LegalLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-default bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/"><img src="/logo.png" alt="Refrll" className="h-9 w-auto" /></Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms"   className="text-ink-muted hover:text-ink transition-colors">Terms</Link>
            <Link to="/privacy" className="text-ink-muted hover:text-ink transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-ink-muted hover:text-ink transition-colors">Cookies</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-display text-4xl font-bold text-ink mb-3">{title}</h1>
          <p className="text-ink-muted">{subtitle}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface-alt border border-default text-xs text-ink-muted px-3 py-1.5 rounded-full">
            📅 Effective: {EFFECTIVE}
          </div>
        </div>
        <div className="space-y-10 text-sm text-ink-muted leading-relaxed">
          {children}
        </div>
        <div className="mt-12 border-t border-default pt-8 flex flex-wrap gap-4 text-xs text-ink-faint">
          <Link to="/terms"   className="hover:text-ink transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
          <Link to="/cookies" className="hover:text-ink transition-colors">Cookie Policy</Link>
          <a href={`mailto:${EMAIL}`} className="hover:text-ink transition-colors">{EMAIL}</a>
          <Link to="/"        className="ml-auto hover:text-ink transition-colors">← Back to Refrll</Link>
        </div>
      </div>
    </div>
  );
}

function S({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Refrll. By accessing or using our platform, you agree to be bound by these terms."
    >
      <S title="1. Acceptance of Terms">
        <p>
          By registering for, accessing, or using the Refrll platform ("Platform", "Service"), operated by Refrll ("Company", "we", "us", "our"), you ("User", "you") agree to be legally bound by these Terms & Conditions ("Terms"). If you do not agree to these Terms, you must not use the Platform.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and Refrll, governed by the laws of India. Use of the Platform signifies your acceptance of these Terms, our Privacy Policy, and our Cookie Policy.
        </p>
      </S>

      <S title="2. Description of Service">
        <p>
          Refrll is an online referral networking platform that connects job seekers ("Seekers") with employees willing to provide internal job referrals ("Referrers") at various companies. The Platform facilitates introductions and referral requests but does not guarantee employment outcomes of any kind.
        </p>
        <p>
          Refrll is not a recruitment agency, staffing firm, or employment service. We do not hire on behalf of any company. We are a technology intermediary only.
        </p>
      </S>

      <S title="3. Eligibility">
        <p>
          You must be at least 18 years of age to use the Platform. By using Refrll, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement.
        </p>
        <p>
          The Platform is intended for use by individuals seeking or providing professional employment referrals. Commercial use, resale, or exploitation of the Platform for purposes other than personal professional networking is strictly prohibited without our prior written consent.
        </p>
      </S>

      <S title="4. User Accounts">
        <p>
          You are required to register an account to use most features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are solely responsible for maintaining the confidentiality of your account credentials.
        </p>
        <p>
          You are responsible for all activity that occurs under your account. You must notify us immediately at {EMAIL} if you suspect unauthorised use of your account. We are not liable for any loss or damage arising from your failure to protect your credentials.
        </p>
        <p>
          We reserve the right to suspend or terminate accounts that contain false information, violate these Terms, or are used for fraudulent or abusive purposes.
        </p>
      </S>

      <S title="5. Seeker Conduct">
        <p>As a Seeker, you agree to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Submit only truthful information in your profile and referral applications, including accurate representations of your skills, experience, and qualifications.</li>
          <li>Upload only your own resume and not impersonate any other person.</li>
          <li>Not submit referral requests with the intent to spam, harass, or abuse Referrers.</li>
          <li>Not submit multiple applications for the same role at the same company simultaneously.</li>
          <li>Understand that a referral from a Referrer does not guarantee an interview, offer, or employment and that the hiring decision rests entirely with the target company.</li>
          <li>Not misrepresent the outcome of any referral to any third party.</li>
        </ul>
      </S>

      <S title="6. Referrer Conduct">
        <p>As a Referrer, you agree to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Only register as a Referrer for companies where you are currently employed or have an active professional relationship.</li>
          <li>Review referral requests in good faith and respond within 48 hours where possible.</li>
          <li>Not accept referral requests you do not intend to act on in order to block other Referrers from receiving them.</li>
          <li>Comply with your employer's internal referral policies and HR guidelines. Refrll is not responsible for any employment consequences arising from your use of the Platform.</li>
          <li>Not charge Seekers any fee in exchange for a referral outside of Refrll's official payment mechanisms.</li>
          <li>Keep confidential any personal information of Seekers that you receive through the Platform and use it only for the purpose of providing a referral.</li>
        </ul>
      </S>

      <S title="7. User Content">
        <p>
          You retain ownership of any content you submit to the Platform ("User Content"), including your profile information, resume, and messages. By submitting User Content, you grant Refrll a non-exclusive, royalty-free, worldwide licence to store, display, and share your User Content solely to operate and improve the Platform.
        </p>
        <p>
          You must not upload content that is false, defamatory, obscene, threatening, invasive of another's privacy, infringing of intellectual property rights, or otherwise unlawful. We reserve the right to remove any User Content that violates these Terms without notice.
        </p>
        <p>
          Resumes and personal data submitted are stored securely and shared only with the Referrer assigned to your application, as described in our Privacy Policy.
        </p>
      </S>

      <S title="8. Payments, Subscriptions & Refunds">
        <p>
          Certain features of the Platform may in the future be offered on a paid subscription basis ("Pro Features"). Where applicable, payment terms, pricing, and subscription duration will be clearly communicated before any charge is made.
        </p>
        <p>
          All payments are processed securely through authorised third-party payment processors. Refrll does not store your payment card details.
        </p>
        <p>
          Subscription fees are non-refundable except as required by applicable Indian consumer protection laws. If you believe you have been charged in error, contact us at {EMAIL} within 7 days of the charge.
        </p>
        <p>
          We reserve the right to change pricing at any time, with reasonable prior notice to existing subscribers.
        </p>
      </S>

      <S title="9. Intellectual Property">
        <p>
          All content on the Platform not submitted by users — including the Refrll name, logo, design, software, text, graphics, and data — is owned by or licensed to Refrll and protected by applicable Indian and international intellectual property laws.
        </p>
        <p>
          You may not copy, reproduce, modify, distribute, transmit, display, or create derivative works from any part of the Platform without our express written permission.
        </p>
      </S>

      <S title="10. Privacy">
        <p>
          Your use of the Platform is subject to our <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. Please review it carefully to understand how we collect, use, and protect your personal information.
        </p>
      </S>

      <S title="11. Disclaimers">
        <p>
          The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Refrll does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.
        </p>
        <p>
          Refrll makes no representations or warranties regarding any Referrer's ability or willingness to provide a referral, or any Seeker's suitability for any position. All referrals and hiring decisions are made independently by users and their respective employers.
        </p>
        <p>
          We are not responsible for any loss or damage resulting from reliance on information provided by other users on the Platform.
        </p>
      </S>

      <S title="12. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, Refrll, its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising from your use of or inability to use the Platform.
        </p>
        <p>
          In no event shall Refrll's total liability to you for all claims arising from your use of the Platform exceed the amount paid by you to Refrll in the twelve months preceding the event giving rise to the claim, or ₹1,000, whichever is greater.
        </p>
      </S>

      <S title="13. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Refrll and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any rights of another person or entity.
        </p>
      </S>

      <S title="14. Termination">
        <p>
          We may suspend or terminate your access to the Platform at any time, with or without notice, for any violation of these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Platform will immediately cease.
        </p>
        <p>
          You may delete your account at any time by contacting us at {EMAIL}. Upon deletion, your personal data will be handled in accordance with our Privacy Policy.
        </p>
      </S>

      <S title="15. Governing Law & Dispute Resolution">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising in connection with these Terms shall first be attempted to be resolved through good-faith negotiation.
        </p>
        <p>
          If a dispute cannot be resolved amicably within 30 days, it shall be submitted to binding arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Bengaluru, Karnataka, India. The language of arbitration shall be English.
        </p>
        <p>
          Nothing in this clause prevents either party from seeking urgent injunctive or other equitable relief from a court of competent jurisdiction.
        </p>
      </S>

      <S title="16. Changes to These Terms">
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. We will notify registered users of material changes via email or in-app notification. Your continued use of the Platform after any changes constitutes your acceptance of the new Terms.
        </p>
      </S>

      <S title="17. Contact">
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <div className="bg-surface-alt rounded-xl p-4 space-y-1">
          <p className="font-semibold text-ink">Refrll</p>
          <p>Email: <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a></p>
          <p>Website: <a href="https://refrll.com" className="text-accent hover:underline">refrll.com</a></p>
        </div>
      </S>
    </LegalLayout>
  );
}
