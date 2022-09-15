/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import styles from "./footer.module.css";
import { AiFillGithub } from "react-icons/ai";

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
      <div className={styles.github_container}>
        <div>
          <a
            href="https://github.com/anthony-fdez/weeatcode-frontend"
            target="_blank"
            rel="noreferrer"
          >
            Frontend Source Code
          </a>
        </div>
        <div>
          <a
            href="https://github.com/anthony-fdez/weeatcode-backend"
            target="_blank"
            rel="noreferrer"
          >
            Backend/Server Source Code
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
