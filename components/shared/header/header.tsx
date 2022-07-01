import React from "react";
import styles from "./header.module.css";

const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <p>Blog</p>
    </header>
  );
};

export default Header;
