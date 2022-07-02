import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./login.module.css";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.signup_card}>
          <h3>Login</h3>
          <hr></hr>
          <form onSubmit={login}>
            <div>
              <p>Enter your email:</p>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                value={email}
                required
                type="email"
                placeholder="example@email.com"
                className={styles.input_box}
              />
            </div>

            <br></br>
            <div>
              <p>Create your password:</p>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                value={password}
                required
                type="password"
                placeholder="password"
                className={styles.input_box}
              />
            </div>
            <hr></hr>
            <div className={styles.box_footer}>
              <Button type="submit">Login</Button>
            </div>
            <br></br>
            <p className={styles.login_in_text}>
              Are you new?{" "}
              <Link href="/signup" passHref>
                <a>Create your account</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export async function getStaticProps(context: NextPageContext) {
  return {
    props: {
      protected: true,
    },
  };
}

export default LoginPage;
