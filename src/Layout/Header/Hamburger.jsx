import React from 'react';

import { BiMenu } from 'react-icons/bi';
import styles from './Hamburger.module.scss';

function Hamburger({ clickHandler }) {
  return (
    <button onClick={clickHandler} className={styles.toggle_btn}>
      <BiMenu size={40} />
    </button>
  );
}

export default Hamburger;
