"use client";

export function DoctorsSection() {
  return (
    <section className="doctors" id="doctors">
      <div className="doctors-copy">
        <p className="eyebrow">For doctors</p>
        <h2>
          The same visit, <em>from the workspace.</em>
        </h2>
        <ul>
          <li>Open the call from the workspace, not a separate app.</li>
          <li>Completed visits stay on the Visits list.</li>
          <li>Notes and the prescription are one step from that row.</li>
        </ul>
      </div>
      <div className="doctors-stage">
        <video autoPlay muted loop playsInline poster="/images/doctors.png">
          <source src="/video/doctor-workspace.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
