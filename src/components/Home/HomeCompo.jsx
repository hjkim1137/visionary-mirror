import homelogo_FIN from './homelogo_FIN.png';
import styles from './Home.module.scss';

function HomeCompo() {
  return (
    <div className={styles.container}>
      <img src={homelogo_FIN}></img>
    </div>
  );
}

export default HomeCompo;
