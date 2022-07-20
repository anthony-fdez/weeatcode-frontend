import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import styles from "./post.module.css";

import Axios from "axios";
import { Alert } from "react-bootstrap";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PostInterface } from "..";
import { downVotePost } from "../../functions/crud/downvotePost";
import { upVotePost } from "../../functions/crud/upvotePost";
import { parseDate } from "../../functions/helpers/parseDate";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import Markdown from "../../components/markdown/markdown";
import PostCommentSection from "../../components/posts/postCommentSection/postCommentSection";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

interface Props {
  status: boolean;
  post: PostInterface;
}

const Post: NextPage<Props> = ({ status, post }) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const token = useAppSelector((state) => state.user.jwtToken);

  const [postWithUserData, setPostWithUserData] =
    useState<PostInterface | null>(null);
  const [upVoted, setUpVoted] = useState<boolean>(false);
  const [downVoted, setDownVoted] = useState<boolean>(false);
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
        setUpVoted(response.data.upVoted);
        setDownVoted(response.data.downVoted);
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
              upVotePost({
                postId: post.post.id,
                token,
                setPostVoteScore,
                postVoteScore,
                upVoted,
                downVoted,
                setUpVoted,
                setDownVoted,
                dispatch,
                isLoggedIn,
              })
            }
            className={upVoted ? styles.upVote_icon_active : styles.upVote_icon}
          />
          <span>{postVoteScore}</span>
          <MdKeyboardArrowDown
            onClick={() =>
              downVotePost({
                postId: post.post.id,
                token,
                setPostVoteScore,
                postVoteScore,
                upVoted,
                downVoted,
                setUpVoted,
                setDownVoted,
                dispatch,
                isLoggedIn,
              })
            }
            className={
              downVoted ? styles.downVote_icon_active : styles.downVote_icon
            }
          />
        </div>
        <div className={styles.post_container}>
          <h1 className={styles.post_title}>{post.post.title}</h1>
          <p>By: {post.post.authorName}</p>
          <p>{parseDate({ date: post.post.updatedAt })}</p>
          <hr></hr>
          <Markdown markdownText={post.post.body} />
          <br></br>
          <PostCommentSection postId={post.post.id} />
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
