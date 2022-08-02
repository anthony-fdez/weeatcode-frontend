/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import styles from "./profile.module.css";

import Axios from "axios";
import { UserInterface } from "../../interfaces/UserInterface";
import { PostInterface } from "../../interfaces/PostInterface";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { Alert, Button, Spinner } from "react-bootstrap";
import Link from "next/link";
import PostCard from "../../components/posts/postCard/postCard";
import Avatar from "react-avatar";
import Head from "next/head";
import moment from "moment";
import { parseDate } from "../../functions/helpers/parseDate";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setisLoggedIn } from "../../redux/slices/user";
import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import { useRouter } from "next/router";

interface Props {
  status: boolean;
  userData: {
    followers: number;
    following: boolean;
    totalPosts: number;
    user: UserInterface;
    posts: PostInterface[];
  };
}

const Post: NextPage<Props> = ({ status, userData }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const token = useAppSelector((state) => state.user.jwtToken);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const userName = useAppSelector((state) => state.user.name);
  const userId = useAppSelector((state) => state.user.userId);

  const [posts, setPosts] = useState<PostInterface[]>();
  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (userData.user.id === userId) {
      router.push("/me");
    }

    if (userData) {
      setPosts(userData.posts);
    }

    Axios.post(
      `${process.env.SERVER_HOST}/users/user_data`,
      {
        userId: userData.user.id,
      },
      {
        headers: {
          Authorization: token || "",
        },
      }
    ).then((response) => {
      console.log(response);
      setFollowing(response.data.data.following);
      setPosts(response.data.data.posts);
    });
  }, []);

  const followUser = () => {
    if (!isLoggedIn) {
      return dispatch(setAskToLoginPopup(true));
    }

    setLoadingFollow(true);

    Axios.post(
      `${process.env.SERVER_HOST}/users/follow`,
      {
        userId: userData.user.id,
        userName: userName,
      },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        setFollowing(!following);
      })
      .catch((e) => {
        console.log(e);
        toast.error(`Unable to follow ${userData.user.name}.`);
      })
      .finally(() => {
        setLoadingFollow(false);
      });
  };

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
          <h3>Posts:</h3>
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
          <div className={styles.not_found_container}>
            <img
              className={styles.no_posts_image}
              alt="Not found ballon"
              src="/illustrations/server.svg"
            />
            <h4>There was an error.</h4>
            <p>Please try again later.</p>
          </div>
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
              <p>{userData.followers} followers.</p>

              {following ? (
                <Button
                  variant="outline-danger"
                  className={styles.follow_button}
                  onClick={followUser}
                >
                  {loadingFollow ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Unfollow"
                  )}
                </Button>
              ) : (
                <Button
                  className={styles.follow_button}
                  onClick={followUser}
                  variant="primary"
                >
                  {loadingFollow ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Follow"
                  )}
                </Button>
              )}
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

  const res = await Axios.post(`${process.env.SERVER_HOST}/users/user_data`, {
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
