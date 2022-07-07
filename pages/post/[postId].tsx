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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import rangeParser from "parse-numeric-range";
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

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const hasMeta = node?.data?.meta;

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, "");
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)[1]
            : "0";
          const highlightLines = rangeParser(strlineNumbers);
          const highlight = highlightLines;
          const data: string = highlight.includes(applyHighlights)
            ? "highlight"
            : null;
          return { data };
        } else {
          return {};
        }
      };

      return match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta ? true : false}
          useInlineStyles={true}
          lineProps={applyHighlights}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      );
    },
  };

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
          <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {post.post.body}
          </ReactMarkdown>
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
