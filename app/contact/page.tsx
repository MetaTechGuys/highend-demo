import styles from "../page.module.css";
import Form from "../components/Form/Form";
import Location from "../components/Location/Location";

export default function Contact() {
  return (
    <div className={styles.page}>
      <Location />
      <Form />
    </div>
  );
}
