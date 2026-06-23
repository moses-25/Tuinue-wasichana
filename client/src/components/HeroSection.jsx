import { useEffect, useRef } from 'react';
import heroImg from '../assets/images/image 1.jpg';
import './HeroSection.css';

const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const offset = window.scrollY;
      const hero = heroRef.current;
      hero.style.setProperty('--parallax-offset', `${offset * 0.4}px`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-background">
        <img src={heroImg} alt="" className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-grain" />
      </div>

      <div className="hero-content">
        <p className="hero-subtitle">Tuinue Wasichana</p>
        <h1 className="hero-title">
          One girl.<br />
          One chance.<br />
          <span className="hero-title-accent">Infinite possibilities.</span>
        </h1>
      </div>

      <div className="hero-scroll">
        <span className="hero-scroll-text">Scroll to explore our work</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
};

export default HeroSection;
