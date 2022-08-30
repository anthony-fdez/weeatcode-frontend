/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import styles from "./footer.module.css";

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        <img
          className={styles.logo}
          src="/images/logo.png"
          alt="We eat code logo"
        />
        <p>
          We love coding! we wake up coding, eat code and go to sleep coding!
        </p>
        <ul className={styles.footer_list}>
          <li>
            <Link href="/tutorial" passHref>
              <a className={styles.link}>
                What is WeEatCode and little tutorial
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className={styles.bottom}>
        <p>
          <Link href="/copyright" passHref>
            <a>Copyright License</a>
          </Link>{" "}
          by Anthony Fernandez
        </p>
      </div>
    </footer>
  );
};

export default Footer;
