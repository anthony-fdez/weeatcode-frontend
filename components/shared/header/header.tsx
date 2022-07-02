import React from "react";
import styles from "./header.module.css";

const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <h4>Blog</h4>
        <div>
          <h5></h5>
        </div>
      </div>
    </header>
  );
};

export default Header;
