/* eslint-disable @next/next/no-img-element */
import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./search.module.css";
import Axios from "axios";
import { PostInterface } from "../../interfaces/PostInterface";
import { Alert, Tab, Tabs } from "react-bootstrap";
import PostCard from "../../components/posts/postCard/postCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { UserInterface } from "../../interfaces/UserInterface";
import Avatar from "react-avatar";
import moment from "moment";
import { parseDate } from "../../functions/helpers/parseDate";
import Link from "next/link";
import UserCard from "../../components/userCard/userCard";

const Search: NextPage = () => {
  const router = useRouter();

  const { query } = router.query;

  const token = useAppSelector((state) => state.user.jwtToken);

  const [posts, setPosts] = useState<PostInterface[] | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [users, setUsers] = useState<UserInterface[] | null>(null);

  useEffect(() => {
    if (!query) {
      setIsLoadingData(false);
      setPosts([]);
      return;
    }

    setIsLoadingData(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/search`,
      { text: query },
      {
        headers: { Authorization: token || "" },
      }
    )
      .then((response) => {
        setIsLoadingData(false);
        setPosts(response.data.posts);
        setUsers(response.data.users);
      })
      .catch((e) => {
        setIsLoadingData(false);
      });
  }, [query]);

  const renderPostsCards = (): JSX.Element => {
    if (isLoadingData) {
      return (
        <>
          <Skeleton
            style={{ marginBottom: "10px" }}
            borderRadius={13}
            count={10}
            height={150}
          />
        </>
      );
    }

    if (!posts) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Error.</Alert.Heading>
          <p>We are unable to load posts at this time</p>
        </Alert>
      );
    }

    if (posts.length <= 0) {
      return (
        <>
          <h1>Posts</h1>
          <hr></hr>
          <div className={styles.empty}>
            <img
              className={styles.image}
              src="/illustrations/empty.svg"
              alt="Empty"
            />
            <h1>So empty...</h1>
            <p>
              We could not find any posts that contained &rdquo;{query}&rdquo;
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <br></br>
        <h1>Posts</h1>
        <br></br>
        {posts.map((post: PostInterface, index: number) => {
          return <PostCard key={index} post={post} />;
        })}
      </>
    );
  };

  const renderUserCards = (): JSX.Element => {
    if (isLoadingData) {
      return (
        <>
          <Skeleton
            style={{ marginBottom: "10px" }}
            borderRadius={13}
            count={3}
            height={150}
          />
        </>
      );
    }

    if (!users) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Error.</Alert.Heading>
          <p>We are unable to load users at this time.</p>
        </Alert>
      );
    }

    if (users.length <= 0) {
      return (
        <>
          <h1>Users</h1>
          <hr></hr>
          <div className={styles.empty}>
            <h1>No users found...</h1>
            <p>
              We could not find any user that contained &rdquo;{query}&rdquo;
            </p>
          </div>
        </>
      );
    }

    return (
      <>
        <h1>Users</h1>
        <br></br>
        {users.map((user: any, index: number) => {
          return <UserCard user={user} key={index} />;
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <h4>Results for &rdquo;{query}&rdquo;</h4>
        <hr></hr>
        <br></br>
        <div className={styles.users_container}>{renderUserCards()} </div>
        <div className={styles.posts_container}>{renderPostsCards()}</div>
      </main>
    </div>
  );
};

export default Search;
