import styles from "./page.module.css";
import Hero from "./components/Hero/Hero";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
    </div>
  );
}
