import React from "react";
import styles from "./footer.module.css";

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <h1>WeEatCode</h1>
        <p>
          We love coding! we wake up coding, eat code and go to sleep coding!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
