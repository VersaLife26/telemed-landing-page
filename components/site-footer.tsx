import { DOCTOR, PATIENT } from "@/lib/links";

const STORY_LINKS = [
  { href: "#what", label: "What it is" },
  { href: "#how", label: "How to use" },
  { href: "#why", label: "Why VersaLife" },
  { href: "#doctors", label: "For doctors" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden />

      <div className="site-footer-top">
        <div className="site-footer-brand">
          <a className="site-footer-mark" href="#top">
            <img src="/logo.svg" alt="" width={40} height={42} />
            <span>
              Versa<span className="is-mint">Life</span>
            </span>
          </a>
          <h2 className="site-footer-title">
            A booked visit.
            <em>Not a chat thread.</em>
          </h2>
          <p className="site-footer-tagline">
            Video consultations for patients and doctors in Sri Lanka — with a named person, a quoted fee, and notes
            that stay on the visit.
          </p>
        </div>

        <div className="site-footer-ctas">
          <a className="btn site-footer-cta-primary" href={`${PATIENT}/register`}>
            Create a patient account
            <span className="arrow" aria-hidden>
              →
            </span>
          </a>
          <a className="btn site-footer-cta-ghost" href={DOCTOR}>
            Doctor workspace
          </a>
        </div>
      </div>

      <div className="site-footer-inner">
        <nav className="site-footer-nav" aria-label="On this page">
          <p className="site-footer-heading">On this page</p>
          <ul>
            {STORY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer-nav" aria-label="Apps">
          <p className="site-footer-heading">Apps</p>
          <ul>
            <li>
              <a href={`${PATIENT}/register`}>Create patient account</a>
            </li>
            <li>
              <a href={`${PATIENT}/login`}>Patient sign in</a>
            </li>
            <li>
              <a href={DOCTOR}>Doctor workspace</a>
            </li>
          </ul>
        </nav>

        <div className="site-footer-nav">
          <p className="site-footer-heading">Care</p>
          <p className="site-footer-aside">
            This page introduces the service. Care happens in the patient and doctor apps after you sign in.
          </p>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p className="site-footer-copy">© {year} VersaLife Health</p>
        <a className="site-footer-top-link" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  );
}
