import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./login.module.css";
import Axios from "axios";
import {
  setisLoggedIn,
  setToken,
  setUserId,
  setUserName,
} from "../../redux/slices/user";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { useRouter } from "next/router";
import { seteuid } from "process";
import { NextSeo } from "next-seo";

const LoginPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    Axios.post(`${process.env.SERVER_HOST}/users/login`, {
      name,
      email,
      password,
    })
      .then((response) => {
        toast.success("Logged in successfully!");

        dispatch(setToken(response.data.token));
        dispatch(setisLoggedIn(true));
        dispatch(setUserId(response.data.user.userId));
        dispatch(setUserName(response.data.user.name));

        router.push("/");
      })
      .catch((e) => {
        if (e.response.data) {
          return toast.error(e.response.data.message || "Server error");
        }

        toast.error("Server error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main>
      <NextSeo title="Login Page - WeEatCode" />
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
                {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>{" "}
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

export default LoginPage;
