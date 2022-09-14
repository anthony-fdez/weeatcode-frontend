import React from "react";
import styles from "./onThisPage.module.css";

const OnThisPage = () => {
  return (
    <>
      <div className={styles.container}>
        <h4>On this page</h4>
        <ul className={styles.list}>
          <li>Header 1 with more test</li>
          <li>Header 1</li>
          <li>Header 1</li>
          <li>Header 1</li>
        </ul>
      </div>
    </>
  );
};

export default OnThisPage;
