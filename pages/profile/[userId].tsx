/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import styles from "./post.module.css";

import Axios from "axios";

interface Props {
  status: boolean;
  userData: null;
}

const Post: NextPage<Props> = ({ status, userData }) => {
  return (
    <>
      <main className={styles.container}></main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { userId } = context.query;

  const res = await Axios.post("http://localhost:3001/users/user_data", {
    userId,
  })
    .then((response) => {
      return response;
    })
    .catch((e) => {
      return null;
    });

  if (!res) {
    return { props: { status: "err" } };
  }

  // Pass data to the page via props
  return { props: { status: "ok", userData: res.data } };
}

export default Post;
