/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import styles from "./profile.module.css";

import Axios from "axios";
import { UserInterface } from "../../interfaces/UserInterface";
import { PostInterface } from "../../interfaces/PostInterface";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Alert, Button } from "react-bootstrap";
import Link from "next/link";
import PostCard from "../../components/posts/postCard/postCard";
import Avatar from "react-avatar";
import Head from "next/head";
import moment from "moment";
import { parseDate } from "../../functions/helpers/parseDate";

interface Props {
  status: boolean;
  userData: {
    totalPosts: number;
    user: UserInterface;
    posts: PostInterface[];
  };
}

const Post: NextPage<Props> = ({ status, userData }) => {
  const posts = userData.posts;

  console.log(userData);

  const renderPosts = () => {
    if (!posts || posts.length === 0) {
      return (
        <>
          <div className={styles.not_found_container}>
            <img
              className={styles.no_posts_image}
              alt="Not found ballon"
              src="/illustrations/baloon.svg"
            />
            <h4>{userData.user.name} does not have any posts yet!</h4>
          </div>
        </>
      );
    }

    return (
      <>
        <br></br>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>My posts:</h3>
          <Link href="/post/createPost" passHref={true}>
            <Button>Create New Post</Button>
          </Link>
        </div>
        <br></br>
        {posts.map((post, index) => {
          return <PostCard key={index} post={post} />;
        })}
      </>
    );
  };

  if (!userData) {
    return (
      <>
        <main className={styles.container}>
          <Alert variant="danger">
            <Alert.Heading>
              There was an error getting the information
            </Alert.Heading>
            <p>Please try again later.</p>
          </Alert>
        </main>
      </>
    );
  }

  return (
    <>
      <div>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.container}>
          <div className={styles.avatar_name_container}>
            <Avatar round={true} name={userData.user.name || "AA"} />
            <div className={styles.name_header}>
              <h1>{userData.user.name}</h1>
              {/* <p>{userData.user.}</p> */}
            </div>
          </div>
          <br></br>
          <p>
            Member since: {parseDate({ date: userData.user.createdAt })} -{" "}
            {moment(userData.user.createdAt).fromNow()}
          </p>
          <br></br>

          {renderPosts()}
        </main>

        <footer className={styles.footer}></footer>
      </div>
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
  return { props: { status: "ok", userData: res.data.data } };
}

export default Post;
