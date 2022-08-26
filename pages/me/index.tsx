import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import styles from "./me.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";

import { parseDate } from "../../functions/helpers/parseDate";
import PostCard from "../../components/posts/postCard/postCard";
import { Alert, Button } from "react-bootstrap";
import Link from "next/link";
import moment from "moment";
import Avatar from "react-avatar";
import { PostInterface } from "../../interfaces/PostInterface";

const Home: NextPage = () => {
  const user = useAppSelector((state) => state.user);

  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const [selectedTab, setSelectedTab] = useState<"posts" | "history">("posts");

  const [posts, setPosts] = useState<PostInterface[] | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    setIsLoadingUserData(true);

    Axios.post(
      `${process.env.SERVER_HOST}/users/user_data`,
      { userId: user.userId },
      {
        headers: {
          Authorization: user.jwtToken || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        setPosts(response.data.data.posts);
        setUserData(response.data.data.user);
        setFollowers(response.data.data.followers);
        setFollowing(response.data.data.totalFollowing);

        setIsLoadingUserData(false);
      })
      .catch((e) => {});
  }, [user.jwtToken, user.userId]);

  const loadingSkeleton = (): JSX.Element => {
    return (
      <>
        <main className={styles.container}>
          <Skeleton borderRadius={13} height={50} width={700} />
          <br></br>
          <Skeleton borderRadius={13} count={2} width={400} />
          <br></br>
          <Skeleton
            count={7}
            borderRadius={13}
            height={150}
            style={{ marginBottom: 10 }}
          />
        </main>
      </>
    );
  };

  const renderPosts = () => {
    if (!posts || posts.length === 0) {
      return (
        <>
          <Alert variant="secondary">
            <Alert.Heading>You don&apos;t have any posts yet!</Alert.Heading>
            <hr></hr>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>Start writing your first post now!</p>

              <Link href="/post/createPost" passHref={true}>
                <Button>Create Post</Button>
              </Link>
            </div>
          </Alert>
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

  if (isLoadingUserData) return loadingSkeleton();

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
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <div className={styles.avatar_name_container}>
          <Avatar round={true} name={user.name || "AA"} />
          <div className={styles.name_header}>
            <h1>{user.name}</h1>
            <p>{userData.email}</p>
            <div className={styles.followers_container}>
              <div>
                <p>{posts?.length || "0"}</p>
                <p>posts</p>
              </div>

              <Link href={`/me/followers`} passHref>
                <div className={styles.followers_button}>
                  <p>{followers || "0"}</p>
                  <p>followers</p>
                </div>
              </Link>
              <Link href={`/me/following`} passHref>
                <div className={styles.followers_button}>
                  <p>{following || "0"}</p>
                  <p>following</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <br></br>
        <p>
          Member since: {parseDate({ date: userData.createdAt })} -{" "}
          {moment(userData.createdAt).fromNow()}
        </p>
        <br></br>

        {renderPosts()}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export async function getStaticProps(context: NextPageContext) {
  return {
    props: {
      protected: true,
    },
  };
}

export default Home;
