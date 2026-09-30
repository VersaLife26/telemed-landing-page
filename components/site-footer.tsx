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
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <a className="site-footer-mark" href="#top">
            <img src="/logo.svg" alt="" width={32} height={34} />
            <span>
              VersaLife <strong>Health</strong>
            </span>
          </a>
          <p className="site-footer-tagline">
            Booked video visits for patients and doctors in Sri Lanka — with notes and prescriptions that stay on the
            visit.
          </p>
        </div>

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
      </div>

      <div className="site-footer-bottom">
        <p className="site-footer-copy">
          © {year} VersaLife Health. All rights reserved.
        </p>
        <p className="site-footer-note">
          This site introduces the service. Medical care is delivered in the patient and doctor apps.
        </p>
      </div>
    </footer>
  );
}
