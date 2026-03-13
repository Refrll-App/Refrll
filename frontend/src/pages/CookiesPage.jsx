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
        <div className="space-y-10 text-sm text-ink-muted leading-relaxed">{children}</div>
        <div className="mt-12 border-t border-default pt-8 flex flex-wrap gap-4 text-xs text-ink-faint">
          <Link to="/terms"   className="hover:text-ink transition-colors">Terms & Conditions</Link>
          <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
          <Link to="/cookies" className="hover:text-ink transition-colors">Cookie Policy</Link>
          <a href={`mailto:${EMAIL}`} className="hover:text-ink transition-colors">{EMAIL}</a>
          <Link to="/" className="ml-auto hover:text-ink transition-colors">← Back to Refrll</Link>
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

function Table({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-default">
      <table className="w-full text-xs">
        <thead className="bg-surface-alt">
          <tr>{rows[0].map((h, i) => <th key={i} className="text-left px-4 py-2.5 font-semibold text-ink">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-default">
          {rows.slice(1).map((row, i) => (
            <tr key={i} className="bg-white">
              {row.map((cell, j) => <td key={j} className="px-4 py-2.5 text-ink-muted">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="This policy explains how Refrll uses cookies and similar technologies on our platform."
    >
      <S title="1. What Are Cookies">
        <p>
          Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to the website owner. Cookies set by the website operator are called "first-party cookies". Cookies set by parties other than the website operator are called "third-party cookies".
        </p>
      </S>

      <S title="2. How We Use Cookies">
        <p>Refrll uses cookies for the following purposes:</p>
        <Table rows={[
          ["Cookie Name", "Type", "Purpose", "Duration"],
          ["refreshToken", "Strictly Necessary", "Stores your encrypted authentication refresh token to keep you logged in securely across sessions. HTTP-only; not accessible via JavaScript.", "7 days"],
          ["__refrll_session", "Strictly Necessary", "Maintains your authenticated session state during navigation.", "Session"],
          ["_refrll_prefs", "Functional", "Stores your UI preferences such as selected filters on the leaderboard.", "30 days"],
          ["_refrll_analytics", "Analytics", "Anonymous usage analytics to understand how users interact with the Platform. No personally identifiable information is stored.", "12 months"],
        ]} />
      </S>

      <S title="3. Cookie Categories">
        <p><strong className="text-ink">Strictly Necessary Cookies</strong></p>
        <p>
          These cookies are essential for the Platform to function. They enable core features such as authentication, security, and session management. Without these cookies, the Platform cannot operate. You cannot opt out of strictly necessary cookies while using the Platform.
        </p>
        <p className="mt-3"><strong className="text-ink">Functional Cookies</strong></p>
        <p>
          These cookies remember your preferences and settings to improve your experience. They are not essential to the Platform but make it more convenient to use. You can disable these without significantly affecting core functionality.
        </p>
        <p className="mt-3"><strong className="text-ink">Analytics Cookies</strong></p>
        <p>
          We use privacy-respecting analytics to understand how users navigate the Platform and which features are most used. This data is anonymised and aggregated — we cannot identify individual users from analytics data. You can opt out of analytics cookies.
        </p>
      </S>

      <S title="4. Authentication Cookies (Important)">
        <p>
          The <code className="bg-surface-alt px-1.5 py-0.5 rounded text-ink font-mono">refreshToken</code> cookie is central to your security on Refrll. It is:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>HTTP-only:</strong> Cannot be accessed by JavaScript, protecting against XSS attacks.</li>
          <li><strong>Secure:</strong> Only transmitted over HTTPS in production environments.</li>
          <li><strong>SameSite=Lax:</strong> Not sent on cross-site requests, protecting against CSRF attacks.</li>
          <li>Used to issue new short-lived access tokens (15-minute lifetime) without requiring you to log in again.</li>
        </ul>
        <p>
          This cookie does not contain any personally identifiable information — it contains only an encrypted token that identifies your session.
        </p>
      </S>

      <S title="5. Third-Party Services">
        <p>
          Refrll uses the following third-party services that may set their own cookies or use equivalent technologies:
        </p>
        <Table rows={[
          ["Service", "Purpose", "Privacy Policy"],
          ["Cloudinary", "Secure file storage for uploaded resumes", "cloudinary.com/privacy"],
          ["Resend", "Transactional email delivery", "resend.com/privacy"],
          ["MongoDB Atlas", "Database hosting", "mongodb.com/legal/privacy-policy"],
        ]} />
        <p>
          We encourage you to review these providers' privacy and cookie policies for details on their data practices. Refrll does not control the cookies set by these third parties.
        </p>
        <p>
          Refrll does not use any advertising networks, tracking pixels, or social media tracking cookies.
        </p>
      </S>

      <S title="6. Managing & Disabling Cookies">
        <p>
          You can control cookies through your browser settings. Most browsers allow you to refuse new cookies, delete existing cookies, or be notified when a new cookie is set. Note that disabling strictly necessary cookies will prevent you from logging in or using the Platform.
        </p>
        <p>Browser-specific guides for managing cookies:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-accent hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer" className="text-accent hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="text-accent hover:underline">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noreferrer" className="text-accent hover:underline">Microsoft Edge</a></li>
        </ul>
        <p>
          You can also opt out of analytics tracking by emailing us at <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a>.
        </p>
      </S>

      <S title="7. Do Not Track">
        <p>
          Some browsers offer a "Do Not Track" (DNT) setting. Currently, there is no universal standard for how websites should respond to DNT signals. Refrll does not currently alter its data collection practices in response to DNT signals, but we only use analytics in an anonymised, aggregated manner regardless.
        </p>
      </S>

      <S title="8. Changes to This Policy">
        <p>
          We may update this Cookie Policy to reflect changes in technology or legislation. Material changes will be communicated via in-app notification or email. The effective date at the top of this page reflects the current version.
        </p>
      </S>

      <S title="9. Contact">
        <p>For any questions about our use of cookies:</p>
        <div className="bg-surface-alt rounded-xl p-4 space-y-1">
          <p className="font-semibold text-ink">Refrll</p>
          <p>Email: <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a></p>
        </div>
      </S>
    </LegalLayout>
  );
}
