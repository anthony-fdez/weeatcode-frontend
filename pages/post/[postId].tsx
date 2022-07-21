import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import styles from "./post.module.css";

import Axios from "axios";
import { Alert, Button } from "react-bootstrap";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PostInterface } from "..";
import { downVotePost } from "../../functions/crud/downvotePost";
import { upVotePost } from "../../functions/crud/upvotePost";
import { parseDate } from "../../functions/helpers/parseDate";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

import moment from "moment";
import Markdown from "../../components/markdown/markdown";
import PostCommentSection from "../../components/posts/postCommentSection/postCommentSection";
import { setPostToEdit } from "../../redux/slices/postToEdit";
import { useRouter } from "next/router";

interface Props {
  status: boolean;
  post: PostInterface;
}

const Post: NextPage<Props> = ({ status, post }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const token = useAppSelector((state) => state.user.jwtToken);
  const userId = useAppSelector((state) => state.user.userId);

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

    Axios.post("http://localhost:3001/posts/views/add", {
      postId: post.post.id,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const editedTag = () => {
    return (
      <div className={styles.edited_tag}>
        <p>Edited {moment(post.post.updatedAt).fromNow()}</p>
      </div>
    );
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
          <p>
            Posted: {parseDate({ date: post.post.createdAt })} -{" "}
            {moment(post.post.createdAt).fromNow()}
          </p>
          <br></br>

          <div className={styles.views_container}>
            <div className={styles.views_edit}>
              <p>{post.views} views.</p>

              {post.post.edited && editedTag()}
            </div>
            {post.post.authorId === userId && (
              <Button
                onClick={() => {
                  dispatch(setPostToEdit(post.post.id));
                  router.push("/post/edit");
                }}
              >
                Edit Post
              </Button>
            )}
          </div>
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
