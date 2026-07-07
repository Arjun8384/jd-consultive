import { useEffect, useRef } from 'react';

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const el = ref.current;
    if (!el) return;
    const revealEls = el.querySelectorAll('.reveal');
    revealEls.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return ref;
}
