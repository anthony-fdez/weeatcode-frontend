/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import styles from "./profile.module.css";

import Axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PostCard from "../../components/posts/postCard/postCard";
import { parseDate } from "../../functions/helpers/parseDate";
import { PostInterface } from "../../interfaces/PostInterface";
import { UserInterface } from "../../interfaces/UserInterface";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { setAskToLoginPopup } from "../../redux/slices/askToLoginPopup";
import Link from "next/link";
import { NextSeo } from "next-seo";

interface Props {
  status: string;
  userData: {
    followers: number;
    following: boolean;
    totalPosts: number;
    totalFollowing: number;
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
  const [followingTotal, setFollowingTotal] = useState(0);

  useEffect(() => {
    if (status === "error") {
      return;
    }

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
        followingUserName: userData.user.name,
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
            <p>This user might not exist anymore.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div>
        <NextSeo title={`${userData.user.name} - WeEatCode`} />

        <main className={styles.container}>
          <div className={styles.avatar_name_container}>
            <Avatar round={true} name={userData.user.name || "AA"} />
            <div className={styles.name_header}>
              <h1>{userData.user.name}</h1>

              <div className={styles.followers_container}>
                <div>
                  <p>{userData.totalPosts || "0"}</p>
                  <p>posts</p>
                </div>
                <Link href={`/profile/followers/${userData.user.id}`} passHref>
                  <div>
                    <p>{userData.followers || "0"}</p>
                    <p>followers</p>
                  </div>
                </Link>
                <Link href={`/profile/following/${userData.user.id}`} passHref>
                  <div>
                    <p>{userData.totalFollowing || "0"}</p>
                    <p>following</p>
                  </div>
                </Link>
              </div>
              <p>
                Member since: {parseDate({ date: userData.user.createdAt })} -{" "}
                {moment(userData.user.createdAt).fromNow()}
              </p>

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
    return { props: { status: "error" } };
  }

  // Pass data to the page via props
  return { props: { status: "ok", userData: res.data.data } };
}

export default Post;
