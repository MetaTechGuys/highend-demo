import styles from "../page.module.css";
import Menus from "../components/Menus/Menus";

export default function Home() {
  return (
    <div className={styles.page}>
      <Menus />
    </div>
  );
}
