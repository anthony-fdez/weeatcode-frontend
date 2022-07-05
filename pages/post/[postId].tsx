import { NextPage, NextPageContext, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./post.module.css";

import Axios from "axios";
import { PostInterface } from "..";
import { Alert } from "react-bootstrap";
import { parseDate } from "../../functions/helpers/parseDate";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { upvotePost } from "../../functions/crud/upvotePost";
import { downvotePost } from "../../functions/crud/downvotePost";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

interface Props {
  status: boolean;
  post: PostInterface;
}

const Post: NextPage<Props> = ({ status, post }) => {
  const dispatch = useAppDispatch();
  const isLogedIn = useAppSelector((state) => state.user.isLogedIn);
  const token = useAppSelector((state) => state.user.jwtToken);

  const [postWithUserData, setPostWithUserData] =
    useState<PostInterface | null>(null);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [downvoted, setDownvoted] = useState<boolean>(false);
  const [postVoteScore, setPostVoteScore] = useState<number>(0);

  useEffect(() => {
    if (!post) return;

    setPostVoteScore(post.voteScore);

    Axios.post(
      "http://localhost:3001/posts/get_by_id",
      {
        postId: post.post.id,
      },
      {
        headers: {
          authorization: token || "",
        },
      }
    )
      .then((response) => {
        console.log(response);

        setPostWithUserData(response.data);
        setUpvoted(response.data.upvoted);
        setDownvoted(response.data.downvoted);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (!post) {
    return (
      <main className={styles.alert_container}>
        <Alert variant="danger">
          <Alert.Heading>Could not load this post.</Alert.Heading>
          <p>
            This post might not exist anymore, or maybe our servers are down.
            Check again later.
          </p>
        </Alert>
      </main>
    );
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.votes_container}>
          <MdKeyboardArrowUp
            onClick={() =>
              upvotePost({
                postId: post.post.id,
                token,
                setPostVoteScore,
                postVoteScore,
                upvoted,
                downvoted,
                setUpvoted,
                setDownvoted,
                dispatch,
                isLogedIn,
              })
            }
            className={upvoted ? styles.upvote_icon_active : styles.upvote_icon}
          />
          <span>{postVoteScore}</span>
          <MdKeyboardArrowDown
            onClick={() =>
              downvotePost({
                postId: post.post.id,
                token,
                setPostVoteScore,
                postVoteScore,
                upvoted,
                downvoted,
                setUpvoted,
                setDownvoted,
                dispatch,
                isLogedIn,
              })
            }
            className={
              downvoted ? styles.downvote_icon_active : styles.downvote_icon
            }
          />
        </div>
        <div className={styles.post_container}>
          <h1 className={styles.post_title}>{post.post.title}</h1>
          <p>By: {post.post.authorName}</p>
          <p>{parseDate({ date: post.post.updatedAt })}</p>
          <hr></hr>
          <p>{post.post.body}</p>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { postId } = context.query;

  const res = await Axios.post("http://localhost:3001/posts/get_by_id", {
    postId,
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
  return { props: { status: "ok", post: res.data } };
}

export default Post;
