import Link from "next/link";
import React from "react";
import styles from "./accessDenied.module.css";

const AccessDenied = (): JSX.Element => {
  return (
    <main>
      <div className={styles.container}>
        <div>
          <h3>Access Denied</h3>
          <hr></hr>
          <p>
            Please{" "}
            <Link href="/login" passHref>
              <a> log in</a>
            </Link>
            , or{" "}
            <Link href="/signup" passHref>
              <a>create a new account!</a>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default AccessDenied;
