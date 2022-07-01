import React from "react";
import styles from "./header.module.css";

const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <p>Blog</p>
      </div>
    </header>
  );
};

export default Header;
