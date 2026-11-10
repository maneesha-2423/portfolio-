import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Check, Code2, Copy, Github, Linkedin, Mail, Menu, MoveUpRight, Sparkles, X } from 'lucide-react'

const HeroScene = lazy(() => import('./HeroScene'))
gsap.registerPlugin(ScrollTrigger)

const email = 'maneesha2423@gmail.com'
const github = 'https://github.com/maneesha-2423'
const navItems = [['About', '#about'], ['Work', '#work'], ['Journey', '#journey'], ['Contact', '#contact']]

function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return <p className="eyebrow">{index && <span>{index}</span>}{index && ' / '}{children}</p>
}

function SectionTitle({ index, label, first, second }: { index: string; label: string; first: string; second: string }) {
  return <div className="section-heading" data-reveal><Eyebrow index={index}>{label}</Eyebrow><h2>{first}<br /><em>{second}</em></h2></div>
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => {
      setLeaving(true)
      window.setTimeout(onDone, reduced ? 0 : 650)
    }, reduced ? 30 : 850)
    return () => window.clearTimeout(timer)
  }, [onDone])
  return <div className={`preloader${leaving ? ' preloader--leaving' : ''}`} aria-hidden="true"><div className="preloader__name">EESHA<span>.</span></div><div className="preloader__bar"><i /></div><div className="preloader__meta">PORTFOLIO / 2026</div></div>
}

function App() {
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [active, setActive] = useState('')
  const cursorRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setLoaded(true)
      return
    }
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 })
    let frame = 0
    const tick = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(tick) }
    frame = requestAnimationFrame(tick)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (!loaded || started.current) return
    started.current = true
    const context = gsap.context(() => {
      gsap.fromTo('.hero__eyebrow, .hero__title-line, .hero__role, .hero__copy, .hero__actions, .hero__foot', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.09, ease: 'power3.out', delay: 0.12 })
      gsap.fromTo('.hero__visual', { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.35, ease: 'power3.out', delay: 0.1 })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(element, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('.skill-card, .credential, .timeline__item').forEach((element) => {
        gsap.fromTo(element, { y: 21, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } })
      })
      const track = document.querySelector<HTMLElement>('.project-track')
      const viewport = document.querySelector<HTMLElement>('.projects__viewport')
      if (track && viewport && window.matchMedia('(min-width: 900px)').matches) {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
        gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: viewport, start: 'top top+=88', end: () => `+=${distance()}`, scrub: 0.7, pin: true, invalidateOnRefresh: true } })
      }
      gsap.to('.hero__visual', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      ScrollTrigger.refresh()
    })
    return () => context.revert()
  }, [loaded])

  useEffect(() => {
    const targets = navItems.map(([, href]) => document.querySelector(href)).filter(Boolean) as Element[]
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(`#${entry.target.id}`) })
    }, { rootMargin: '-30% 0px -55% 0px' })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    const glow = glowRef.current
    if (!cursor || !glow || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3' })
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3' })
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.55, ease: 'power3' })
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.55, ease: 'power3' })
    const move = (event: PointerEvent) => { moveX(event.clientX); moveY(event.clientY); glowX(event.clientX); glowY(event.clientY) }
    const over = (event: Event) => { if ((event.target as HTMLElement).closest('a, button')) cursor.classList.add('cursor--active') }
    const out = (event: Event) => { if ((event.target as HTMLElement).closest('a, button')) cursor.classList.remove('cursor--active') }
    const magneticMove = (event: PointerEvent) => {
      const element = event.target as HTMLElement
      const target = element.closest<HTMLElement>('.magnetic')
      if (target) {
        const bounds = target.getBoundingClientRect()
        gsap.to(target, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.12, y: (event.clientY - bounds.top - bounds.height / 2) * 0.12, duration: 0.35, ease: 'power2.out', overwrite: true })
      }
      const card = element.closest<HTMLElement>('.project-card')
      if (card) {
        const bounds = card.getBoundingClientRect()
        card.style.setProperty('--tilt-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`)
        card.style.setProperty('--tilt-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -5}deg`)
      }
    }
    const magneticOut = (event: PointerEvent) => {
      const element = event.target as HTMLElement
      const target = element.closest<HTMLElement>('.magnetic')
      if (target && !target.contains(event.relatedTarget as Node)) gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, .4)' })
      const card = element.closest<HTMLElement>('.project-card')
      if (card && !card.contains(event.relatedTarget as Node)) {
        card.style.setProperty('--tilt-x', '0deg')
        card.style.setProperty('--tilt-y', '0deg')
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointermove', magneticMove)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    document.addEventListener('pointerout', magneticOut)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointermove', magneticMove)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      document.removeEventListener('pointerout', magneticOut)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }
  const closeMenu = () => setMenuOpen(false)

  return <>
    {!loaded && <Preloader onDone={() => setLoaded(true)} />}
    <div className="cursor" ref={cursorRef} aria-hidden="true"><span /></div>
    <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
    <div className="grain" aria-hidden="true" />

    <header className="nav-wrap">
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Eesha, home"><span className="brand__symbol">e.</span><span className="brand__name">Yeturu Maneesha</span></a>
        <div className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={closeMenu} className={active === href ? 'is-active' : ''}>{label}</a>)}
          <a className="nav__contact" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={14} /></a>
        </div>
        <button className="nav__toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </nav>
    </header>

    <main>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero__grid shell">
          <div className="hero__content">
            <p className="eyebrow hero__eyebrow"><span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES <i className="eyebrow__rule" /></p>
            <h1 className="hero__title" id="hero-title"><span className="hero__title-line">Yeturu</span><span className="hero__title-line hero__title-line--last">Maneesha<span className="hero__period">.</span></span></h1>
            <p className="hero__role">Aspiring Software Engineer <span>/</span> Python &amp; ML Developer <span>/</span> B.Tech 2027</p>
            <p className="hero__copy">I build AI agents that automate<br className="desktop-break" /> business workflows.</p>
            <div className="hero__actions"><a className="button button--primary magnetic" href="#work">Explore my work <ArrowDownRight size={17} /></a><a className="button button--quiet magnetic" href="/yeturu-maneesha-resume.txt" download>Download resume <MoveUpRight size={15} /></a></div>
            <div className="hero__foot"><span className="hero__index">01 <i /> 06</span><span>SCROLL TO DISCOVER</span></div>
          </div>
          <div className="hero__visual" aria-label="Interactive 3D abstract AI core. Drag to rotate." role="img">
            <div className="visual__halo visual__halo--one" /><div className="visual__halo visual__halo--two" />
            <div className="visual__label visual__label--top"><span>CORE / 001</span><i /></div>
            <div className="visual__canvas"><Suspense fallback={<div className="scene-fallback" />}><HeroScene /></Suspense></div>
            <div className="visual__label visual__label--bottom"><i /><span>INTELLIGENCE IN MOTION</span></div>
          </div>
          <a className="hero__scroll" href="#about" aria-label="Scroll to About"><span>SCROLL</span><ArrowDown size={16} /></a>
        </div>
        <div className="hero__ambient hero__ambient--violet" /><div className="hero__ambient hero__ambient--cyan" /><div className="hero__bottom-line" />
      </section>

      <section className="about section shell" id="about">
        <SectionTitle index="01" label="A LITTLE ABOUT ME" first="Curiosity, meet" second="engineering." />
        <div className="about__body" data-reveal>
          <p className="about__lead">I’m Eesha, a CSBS student who likes turning <span>messy, real-world problems</span> into thoughtful software.</p>
          <p className="about__text">Currently pursuing my B.Tech at G. Pulla Reddy Engineering College, I work across Python, machine learning, and full-stack development. I’ve built an end-to-end churn prediction model and an e-commerce app, and I’m exploring agentic AI to make everyday business workflows smarter.</p>
          <div className="about__facts"><div><span className="fact__number">08.02</span><span className="fact__label">CURRENT CGPA</span></div><div><span className="fact__number">2027</span><span className="fact__label">GRADUATING</span></div><div><span className="fact__number">02</span><span className="fact__label">FEATURED BUILDS</span></div></div>
        </div>
        <div className="about__deco" aria-hidden="true">EM<span>.</span></div>
      </section>

      <section className="work section" id="work">
        <div className="shell work__head"><SectionTitle index="02" label="SELECTED WORK" first="Proof of" second="practice." /><p className="work__aside">A couple of things I’ve built<br />from curiosity to completion.<span>2024 — 2026</span></p></div>
        <div className="projects__viewport"><div className="project-track">
          <article className="project-card project-card--churn">
            <div className="project-card__top"><span>01 / MACHINE LEARNING</span><span>2025</span></div>
            <div className="churn-art" aria-label="Abstract customer-retention data visualization"><div className="churn-art__grid" /><div className="churn-art__axis churn-art__axis--y" /><div className="churn-art__axis churn-art__axis--x" /><div className="churn-art__line churn-art__line--a" /><div className="churn-art__line churn-art__line--b" /><div className="churn-art__point churn-art__point--a" /><div className="churn-art__point churn-art__point--b" /><div className="churn-art__point churn-art__point--c" /><div className="churn-art__metric"><span>MODEL EVALUATION</span><strong>4×</strong><i>ENSEMBLE MODELS</i></div><div className="churn-art__legend"><i /> RETAINED <i /> AT RISK</div></div>
            <div className="project-card__body"><div><p className="eyebrow">PREDICTIVE ANALYTICS</p><h3>Customer churn<br />prediction</h3></div><a className="round-link" href={github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ArrowUpRight size={20} /></a></div>
            <p className="project-card__desc">Predicting which telecom customers may leave, so teams can reach them before they do. Compared Random Forest, AdaBoost, Gradient Boosting, and XGBoost using accuracy, F1-score, and ROC-AUC.</p>
            <div className="tags"><span>Python</span><span>Pandas</span><span>NumPy</span><span>Scikit-learn</span><span>XGBoost</span><span>Seaborn</span></div>
          </article>
          <article className="project-card project-card--commerce">
            <div className="project-card__top"><span>02 / FULL-STACK DEVELOPMENT</span><span>2024</span></div>
            <div className="commerce-art" aria-label="Minimal interface illustration of an online shop"><div className="commerce-art__window"><div className="commerce-art__bar"><span /><span /><span /><i>FORM / FUNCTION</i></div><div className="commerce-art__nav"><b>shop<span>.</span></b><small>COLLECTION&nbsp;&nbsp;&nbsp; ABOUT&nbsp;&nbsp;&nbsp; BAG (02)</small></div><div className="commerce-art__hero"><span>OBJECTS FOR<br />EVERY DAY.</span><div className="commerce-art__object"><i /><b /></div><small>NEW COLLECTION — 2025</small></div><div className="commerce-art__tiles"><i /><i /><i /></div></div><div className="commerce-art__caption">THE EVERYDAY OBJECTS STORE <ArrowUpRight size={13} /></div></div>
            <div className="project-card__body"><div><p className="eyebrow">WEB APPLICATION</p><h3>E-commerce,<br />end to end.</h3></div><a className="round-link" href={github} target="_blank" rel="noreferrer" aria-label="Open GitHub profile"><ArrowUpRight size={20} /></a></div>
            <p className="project-card__desc">A complete shopping flow: registration, login, product browsing, cart, and checkout, backed by a relational MySQL database.</p>
            <div className="tags"><span>HTML &amp; CSS</span><span>JavaScript</span><span>Python</span><span>MySQL</span></div>
          </article>
          <div className="project-endcap"><div className="project-endcap__icon"><Sparkles size={21} /></div><p>More ideas<br />in progress.</p><a href="#contact">Have one in mind? <ArrowUpRight size={14} /></a><span>03 — ∞</span></div>
        </div></div>
        <div className="work__progress shell"><span>SCROLL TO EXPLORE →</span><div><i /></div><span>02 / 02</span></div>
      </section>

      <section className="journey section shell" id="journey">
        <div className="journey__left" data-reveal><Eyebrow index="03">THE FOUNDATION</Eyebrow><h2>Learning<br />by <em>building.</em></h2><p className="journey__note">Every step adds a new lens. This is where mine started.</p><div className="journey__stamp">KURNOOL<br /><span>ANDHRA PRADESH, INDIA</span></div></div>
        <div className="journey__right">
          <div className="timeline__item"><div className="timeline__date">GRAD. 2027 <span className="timeline__now">IN PROGRESS</span></div><div className="timeline__marker"><i /></div><div className="timeline__content"><p className="eyebrow">BACHELOR’S DEGREE</p><h3>Computer Science &amp;<br />Business Systems</h3><p>G. Pulla Reddy Engineering College</p><p className="timeline__place">Kurnool, Andhra Pradesh</p><div className="timeline__result"><strong>8.02</strong><span>CGPA</span></div></div></div>
          <div className="timeline__item"><div className="timeline__date">COMPLETED 2023</div><div className="timeline__marker"><i /></div><div className="timeline__content"><p className="eyebrow">INTERMEDIATE</p><h3>Mathematics, Physics<br />&amp; Chemistry</h3><p>Nalanda Junior College</p><p className="timeline__place">Anantapur, Andhra Pradesh</p><div className="timeline__result"><strong>9.3</strong><span>GRADE</span></div></div></div>
        </div>
      </section>

      <section className="skills section" id="skills">
        <div className="shell skills__head"><SectionTitle index="04" label="THE TOOLKIT" first="Good tools." second="Better questions." /><p className="skills__intro">A growing toolkit for building useful, reliable things.</p></div>
        <div className="shell skills__grid">
          <article className="skill-card"><div className="skill-card__head"><span>01</span><Code2 size={17} /></div><h3>Languages &amp;<br />databases</h3><div className="skill-list"><span>Python</span><span>MySQL</span><span>JavaScript</span><span>HTML</span><span>CSS</span></div><div className="skill-card__orb skill-card__orb--one" /></article>
          <article className="skill-card"><div className="skill-card__head"><span>02</span><ArrowDown size={17} /></div><h3>Core<br />concepts</h3><div className="skill-list"><span>Object-oriented programming</span><span>Data structures &amp; algorithms</span><span>Operating systems</span></div><div className="skill-card__orb skill-card__orb--two" /></article>
          <article className="skill-card"><div className="skill-card__head"><span>03</span><Sparkles size={17} /></div><h3>ML &amp;<br />tools</h3><div className="skill-list"><span>Pandas</span><span>NumPy</span><span>Scikit-learn</span><span>XGBoost</span><span>Git</span></div><div className="skill-card__orb skill-card__orb--three" /></article>
        </div>
        <div className="skills__ticker" aria-hidden="true"><div>PYTHON <i>✳</i> MACHINE LEARNING <i>✳</i> CREATIVE PROBLEM SOLVING <i>✳</i> PYTHON <i>✳</i> MACHINE LEARNING <i>✳</i> CREATIVE PROBLEM SOLVING <i>✳</i></div></div>
      </section>

      <section className="credentials section shell" id="credentials">
        <div className="credentials__head"><SectionTitle index="05" label="ALWAYS IN SESSION" first="Proof of" second="curiosity." /><p>Learning doesn’t stop when<br />the coursework does.</p></div>
        <div className="credentials__grid">
          <article className="credential"><div className="credential__seal"><span>PY</span><i /></div><div className="credential__content"><p className="eyebrow">2025 / INTERNSHALA TRAININGS</p><h3>Programming in Python<br />with AI</h3><a href="https://trainings.internshala.com/" target="_blank" rel="noreferrer">View provider <ArrowUpRight size={13} /></a></div><span className="credential__number">01</span></article>
          <article className="credential"><div className="credential__seal credential__seal--cyan"><span>AI</span><i /></div><div className="credential__content"><p className="eyebrow">2026 / INFOSYS SPRINGBOARD</p><h3>Introduction to<br />Artificial Intelligence</h3><a href="https://infyspringboard.onwingspan.com/" target="_blank" rel="noreferrer">View provider <ArrowUpRight size={13} /></a></div><span className="credential__number">02</span></article>
          <article className="credential"><div className="credential__seal credential__seal--amber"><span>Q</span><i /></div><div className="credential__content"><p className="eyebrow">2025 — 2026 / QUANTUM VALLEY</p><h3>Quantum Fundamentals<br />Program</h3><a href="https://quantumvalley.org/" target="_blank" rel="noreferrer">Amaravati Quantum Valley, Qubitech &amp; WISER <ArrowUpRight size={13} /></a></div><span className="credential__number">03</span></article>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="contact__orb contact__orb--one" /><div className="contact__orb contact__orb--two" />
        <div className="shell contact__inner">
          <div className="contact__top" data-reveal><Eyebrow index="06">YOUR TURN</Eyebrow><span className="contact__availability"><i /> OPEN TO INTERNSHIPS &amp; OPPORTUNITIES</span></div>
          <h2 data-reveal>Let’s make<br /><em>something matter.</em></h2>
          <div className="contact__bottom" data-reveal><p>Have an interesting problem, a role, or just a good idea?<br />I’d love to hear about it.</p><a className="contact__email" href={`mailto:${email}`}>{email}<ArrowUpRight size={20} /></a></div>
          <div className="contact__card" data-reveal>
            <div className="contact__location"><span className="eyebrow">CURRENTLY BASED IN</span><p>Cuddapah, Andhra Pradesh<br />India <a href="tel:+917569036145">+91 75690 36145</a></p></div>
            <button className="copy-button" onClick={copyEmail}><span>{copied ? 'Copied to clipboard' : 'Copy email address'}</span>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            <div className="contact__socials"><a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github size={17} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a><a href={`mailto:${email}`} aria-label="Send an email"><Mail size={17} /></a></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="footer shell"><a className="brand" href="#home"><span className="brand__symbol">e.</span><span className="brand__name">Yeturu Maneesha</span></a><span>DESIGNED WITH INTENTION <i>·</i> © 2026</span><a href="#home" className="footer__top">BACK TO TOP <ArrowUpRight size={13} /></a></footer>
  </>
}

export default App