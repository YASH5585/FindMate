import { Spinner } from '@/components/ui/Spinner';
import styles from './LoadingState.module.css';

export const LoadingState = () => (
  <div className={styles.container}>
    <Spinner />
    <p className={styles.text}>Loading...</p>
  </div>
);