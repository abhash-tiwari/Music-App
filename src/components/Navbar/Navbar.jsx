import React from 'react';
import styles from './Navbar.module.css';
import Logo from '../../assets/Logo (1).png'
import AvatarImage from '../../assets/spo.png'

const Navbar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navItem}> <img src={Logo} alt="Logo" /></div>
    <img src={AvatarImage} alt="User_image_random" className={styles.navImg}/>
    </div>
  );
};

export default Navbar;
