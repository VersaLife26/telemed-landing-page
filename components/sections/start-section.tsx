import { DOCTOR, PATIENT } from "@/lib/links";

export function StartSection() {
  return (
    <section className="start" id="start">
      <video className="hero-video" autoPlay muted loop playsInline poster="/images/hero-clinician.png">
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="start-copy">
        <p className="eyebrow">Start</p>
        <h2>
          Book the next visit <em>when you need it.</em>
        </h2>
        <p>Create a patient account, or sign in if you already have one. Doctors use a separate sign-in.</p>
        <div className="hero-actions">
          <a className="btn btn-ink" href={`${PATIENT}/register`}>
            Create a patient account
            <span className="arrow" aria-hidden>→</span>
          </a>
          <a className="btn btn-quiet" href={DOCTOR}>Doctor sign in</a>
        </div>
      </div>
    </section>
  );
}
