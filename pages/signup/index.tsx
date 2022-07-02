/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Link from "next/link";
import React, { ChangeEventHandler, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./signupPage.module.css";

import Axios from "axios";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { setToken } from "../../redux/slices/user";

const SignupPage: NextPage = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signup = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setToken("token"));
  };

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.signup_card}>
          <h3>Create an Account!</h3>
          <hr></hr>
          <form onSubmit={signup}>
            <div>
              <p>Enter your name</p>
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
                value={name}
                required
                name="name"
                type="text"
                placeholder="John Smith"
                className={styles.input_box}
              />
            </div>
            <br></br>
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
              <Button type="submit">Signup</Button>
            </div>
            <br></br>
            <p className={styles.login_in_text}>
              You already have an account?{" "}
              <Link href="/login" passHref>
                <a>Sign in</a>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
