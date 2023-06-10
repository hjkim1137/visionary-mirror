// export default HomeCompo;

import styles from './Home.module.scss';

function HomeCompo() {
  return (
    <h1 className={styles.container}>
      WELCOME TO <span className={styles.title}>VISIONARY</span>
    </h1>
  );
}

export default HomeCompo;
