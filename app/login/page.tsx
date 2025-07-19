import LoginEmployee from '../components/LoginEmployee/LoginEmployee';
import styles from '../page.module.css';

export default function EmployeePage() {
  return (
    <div className={styles.page}>
      <LoginEmployee />
    </div>
  );
}