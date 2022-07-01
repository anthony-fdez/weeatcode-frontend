import React from "react";
import styles from "./footer.module.css";

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <p>Footer</p>
      </div>
    </footer>
  );
};

export default Footer;
