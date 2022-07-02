/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Link from "next/link";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import styles from "./signupPage.module.css";

import Axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  setIsLogedIn,
  setToken,
  setUserId,
  setUserName,
} from "../../redux/slices/user";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const SignupPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signup = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    Axios.post("http://localhost:3001/users/signup", {
      name,
      email,
      password,
    })
      .then((response) => {
        toast.success("Account created!");

        dispatch(setToken(response.data.token));
        dispatch(setIsLogedIn(true));
        dispatch(setUserId(response.data.user.userId));
        dispatch(setUserName(response.data.user.name));

        router.push("/");
      })
      .catch((e) => {
        console.log(e);

        toast.error(e.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
                name="email"
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
                name="password"
                placeholder="password"
                className={styles.input_box}
              />
            </div>
            <hr></hr>
            <div className={styles.box_footer}>
              <Button style={{ width: "100px" }} type="submit">
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Signup"
                )}
              </Button>
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
