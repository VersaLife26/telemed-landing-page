"use client";

import { useState } from "react";
import { DOCTOR, PATIENT } from "@/lib/links";

const WORDS = [
  "Accessible",
  "Trusted",
  "Private",
  "Local",
  "Clear",
  "Caring",
  "Secure",
  "On time",
];

const FACES = [
  "/images/call-doctor.png",
  "/images/call-patient.png",
  "/images/feature-consult.png",
  "/images/feature-imaging.png",
];

const STEPS = [
  {
    title: "Create your account",
    body: "Register with your name and date of birth. Google sign-in works too — add your date of birth before the first booking.",
  },
  {
    title: "Choose a doctor and a time",
    body: "Browse verified clinicians, see the fee, and pick an open slot. The time you confirm is the time you pay for.",
  },
  {
    title: "Say who the visit is for",
    body: "Book for yourself, or for someone else. Their name and date of birth are saved on that visit, and age is calculated for the appointment day.",
  },
  {
    title: "Pay, then join the call",
    body: "Checkout confirms the booking. Near the start time, open a full-screen video room — camera and microphone stay off once the visit ends.",
  },
  {
    title: "Leave with a record",
    body: "The doctor writes clinical notes and can issue a prescription. You can open the visit summary and download the PDF.",
  },
];

const SERVICES = [
  {
    title: "Video consultations",
    body: "Meet your doctor from home in a dedicated call, with chat and files beside the video.",
    tone: "blue",
  },
  {
    title: "Prescriptions",
    body: "Name and age come from the booking. The doctor issues a PDF you can download and keep.",
    tone: "mint",
  },
  {
    title: "Visit history",
    body: "Doctors reopen completed visits for notes, the prescription, and a short summary of who was seen.",
    tone: "sky",
  },
  {
    title: "Your records",
    body: "Files from the visit stay with your account, so the next consultation starts from what already happened.",
    tone: "sand",
  },
];

const FAQS = [
  {
    q: "Who is VersaLife for?",
    a: "Patients in Sri Lanka who want a booked video visit with a doctor, and doctors who already practise on the platform. This page is the public introduction. Care itself happens in the patient and doctor apps.",
  },
  {
    q: "Can I book for a child or a parent?",
    a: "Yes. On the booking form choose “for someone else”, enter their name and date of birth, and optionally how they are related to you. The prescription uses that person, not only the account name.",
  },
  {
    q: "When can I join the video?",
    a: "The call opens in a window around your appointment time. If you arrive too early, the page holds you until the room is ready. When the doctor ends the visit, your camera stops and you go to the summary.",
  },
  {
    q: "What do I receive after the visit?",
    a: "A visit summary, clinical notes from the doctor, and a prescription when one is issued. Doctors can open the same completed visit later from their Visits list.",
  },
  {
    q: "Is this the same as the patient app?",
    a: "No. This site explains the service. Sign in or create an account on the patient app to book. Doctors sign in on the doctor app.",
  },
];

export function Landing() {
  const [open, setOpen] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  return (
    <>
      <header className="nav">
        <a className="mark" href="#top" aria-label="VersaLife">
          <img src="/logo.svg" alt="" width={40} height={42} />
        </a>
        <nav className="nav-pills" aria-label="Page">
          <a className="is-current" href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
        </nav>
        <div className="nav-end">
          <a className="text-link" href="#faq">FAQ</a>
          <a className="text-link" href={DOCTOR}>Doctor sign in</a>
          <a className="btn btn-light" href={`${PATIENT}/login`}>Log in</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media">
            {videoReady ? null : (
              <img className="hero-still" src="/images/hero-clinician.png" alt="" />
            )}
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Care, booked and on the record</p>
            <h1>VersaLife: a doctor visit, from the room you are already in.</h1>
            <p className="lede">
              Choose a clinician, say who the appointment is for, pay, and join a private video
              visit. Notes and the prescription stay attached to that appointment.
            </p>
            <div className="hero-actions">
              <a className="btn btn-light" href={`${PATIENT}/register`}>
                Get started
              </a>
              <a className="btn btn-ghost" href="#how">
                See how a visit works
              </a>
            </div>
          </div>
          <a className="scroll-hint" href="#ribbon">
            Scroll
            <span aria-hidden>↓</span>
          </a>
        </section>

        <section className="ribbon" id="ribbon" aria-label="What the service is built around">
          <p>A booked video visit with a doctor, with the person, the notes, and the prescription kept together.</p>
          <div className="marquee">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy}>
                  {WORDS.map((word, i) => (
                    <li key={`${copy}-${word}`}>
                      <img src={FACES[i % FACES.length]} alt="" />
                      {word}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <p className="ghost" aria-hidden>
            VersaLife
          </p>
          <div className="polaroids">
            <article className="polaroid tilt-left">
              <img src="/images/feature-consult.png" alt="A doctor on a video consultation" />
              <h2>A real appointment</h2>
              <p>Not an open chat. You book a slot, the doctor sees who the visit is for, and the call has a start and an end.</p>
            </article>
            <article className="polaroid tilt-right">
              <img src="/images/feature-imaging.png" alt="A clinician reviewing a scan during a visit" />
              <h2>Something you can keep</h2>
              <p>After the call, the visit summary, clinical notes, and prescription PDF remain on that appointment.</p>
            </article>
          </div>
          <p className="about-line">VersaLife is the patient and doctor software behind a telemedicine visit in Sri Lanka.</p>
        </section>

        <section className="services" id="services">
          <h2 className="giant">What you can do</h2>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <article key={s.title} className={`service ${s.tone}`}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
          <a className="btn btn-dark center" href={`${PATIENT}/doctors`}>
            Find a doctor
          </a>
        </section>

        <section className="stage" id="call">
          <div className="stage-copy">
            <p className="eyebrow">The visit itself</p>
            <h2>A quiet room for two people, not a dashboard.</h2>
            <p>
              Patients join a full-screen call. Doctors open the same visit from their workspace.
              Mute, camera, chat, and files sit on the glass bar. When the consultation ends, the
              camera stops.
            </p>
          </div>
          <div className="slab">
            <div className="slab-bar">
              <div className="slab-brand">
                <img src="/logo.svg" alt="" width={28} height={30} />
                <div>
                  <strong>Consultation</strong>
                  <span>Your booked time</span>
                </div>
              </div>
              <div className="slab-meta">
                <span className="pill">Live</span>
                <span className="who">
                  <img src="/images/call-doctor.png" alt="" />
                  Your doctor
                </span>
              </div>
            </div>
            <div className="tiles">
              <figure>
                <img src="/images/call-doctor.png" alt="Doctor on the video visit" />
                <figcaption>Doctor</figcaption>
              </figure>
              <figure>
                <img src="/images/call-patient.png" alt="Patient on the video visit" />
                <figcaption>You</figcaption>
              </figure>
            </div>
            <div className="slab-controls">
              <span>Mute</span>
              <span>Camera</span>
              <span>Chat</span>
              <span>Files</span>
              <span className="end">End</span>
            </div>
          </div>
        </section>

        <section className="how" id="how">
          <div className="how-head">
            <p className="eyebrow">How a visit happens</p>
            <h2>Five steps, in the order you actually do them.</h2>
          </div>
          <ol>
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="benefits">
          <h2>Why people book it this way</h2>
          <ul>
            <li>
              <strong>The person on the prescription is the person you named.</strong>
              <span>Age is taken from their date of birth on the day of the visit.</span>
            </li>
            <li>
              <strong>You are not guessing the fee at checkout.</strong>
              <span>The price is quoted when you book the slot.</span>
            </li>
            <li>
              <strong>The call has an edge.</strong>
              <span>It opens for the appointment window and closes when the visit ends.</span>
            </li>
            <li>
              <strong>Doctors can look back.</strong>
              <span>Completed visits stay listed, with notes and the prescription one tap away.</span>
            </li>
          </ul>
        </section>

        <section className="faq" id="faq">
          <h2>Questions</h2>
          <div>
            {FAQS.map((item, i) => (
              <div key={item.q} className={open === i ? "item open" : "item"}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                  {item.q}
                  <span aria-hidden>{open === i ? "–" : "+"}</span>
                </button>
                {open === i ? <p>{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="close" id="contact">
          <h2>Book the next visit when you need it.</h2>
          <p>Create a patient account, or sign in if you already have one. Doctors use a separate sign-in.</p>
          <div className="hero-actions">
            <a className="btn btn-light" href={`${PATIENT}/register`}>
              Create a patient account
            </a>
            <a className="btn btn-ghost" href={DOCTOR}>
              Doctor sign in
            </a>
          </div>
        </section>
      </main>

      <footer>
        <a className="mark" href="#top">
          <img src="/logo.svg" alt="" width={28} height={30} />
          VersaLife Health
        </a>
        <a href={`${PATIENT}/login`}>Patient app</a>
        <a href={DOCTOR}>Doctor app</a>
        <a href="#faq">FAQ</a>
      </footer>
    </>
  );
}
