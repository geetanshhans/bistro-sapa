import type { BarInfo } from "@/types/data";
import styles from "@/styles/Footer.module.css";

export default function Footer({ info }: { info: BarInfo }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <div className={styles.brand}>
          bistro<em>.sapa</em>
        </div>
        <ul className={styles.links}>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">Story</a></li>
          <li><a href="#contact">Visit</a></li>
          <li><a href={info.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
        <p className={styles.meta}>© {year} {info.name}</p>
      </div>
    </footer>
  );
}
