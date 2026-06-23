import { useEffect, useState, useRef } from 'react';
import './ImpactMetrics.css';

const metrics = [
  { value: 12547, suffix: '', label: 'girls supported' },
  { value: 2.3, suffix: 'M', label: 'invested to date', prefix: '$' },
  { value: 94, suffix: '%', label: 'stay in school' },
];

const CountUp = ({ end, suffix, prefix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * end);

            if (end < 1000) {
              setCount(Math.round(eased * end * 10) / 10);
            } else {
              setCount(current);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(1);
  };

  return (
    <span ref={ref} className="impact-number">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const ImpactMetrics = () => {
  return (
    <section className="impact-metrics">
      <div className="impact-metrics-inner">
        {metrics.map((metric, i) => (
          <div key={i} className="impact-metric">
            <CountUp
              end={metric.value}
              suffix={metric.suffix}
              prefix={metric.prefix || ''}
            />
            <span className="impact-label">{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactMetrics;
