/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import styles from "./post.module.css";
import { AiFillEye } from "react-icons/ai";
import Axios from "axios";
import { Alert, Button } from "react-bootstrap";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PostInterface } from "../../interfaces/PostInterface";
import { downVotePost } from "../../functions/crud/downvotePost";
import { upVotePost } from "../../functions/crud/upvotePost";
import { parseDate } from "../../functions/helpers/parseDate";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";

import moment from "moment";
import Markdown from "../../components/markdown/markdown";
import PostCommentSection from "../../components/posts/postCommentSection/postCommentSection";
import { setPostToEdit } from "../../redux/slices/postToEdit";
import { useRouter } from "next/router";
import ConfirmDeletePostModal from "../../components/posts/confirmDeletePostModal/confirmDeletePostModal";
import Link from "next/link";

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

  const [isConfirmDeletePostModalOpen, setIsConfirmDeletePostModalOpen] =
    useState(false);

  useEffect(() => {
    if (!post) return;

    setPostVoteScore(post.voteScore);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/get_by_id`,
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

    Axios.post(
      `${process.env.SERVER_HOST}/posts/views/add`,
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
        <div>
          <img
            alt="Error"
            className={styles.error_image}
            src="/illustrations/404.svg"
          />
        </div>
        <br></br>
        <h2>There was an error loading the post.</h2>
        <p>This post might not exist anymore.</p>
      </main>
    );
  }

  return (
    <>
      <ConfirmDeletePostModal
        isOpen={isConfirmDeletePostModalOpen}
        postId={post.post.id}
        handleClose={() => setIsConfirmDeletePostModalOpen(false)}
      />
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
          <p className={styles.by}>
            By:{" "}
            <Link passHref href={`/profile/${post.post.authorId}`}>
              <a>{post.post.authorName}</a>
            </Link>{" "}
          </p>
          <p className={styles.posted}>
            Posted: {parseDate({ date: post.post.createdAt })} -{" "}
            {moment(post.post.createdAt).fromNow()}
          </p>
          <br></br>

          <div className={styles.views_container}>
            <div className={styles.views_edit}>
              <p className={styles.views_text_container}>
                <AiFillEye />
                {post.views}
              </p>

              {post.post.edited && editedTag()}
            </div>
            {post.post.authorId === userId && (
              <div className={styles.delete_edit_button}>
                <Button
                  variant="danger"
                  onClick={() => {
                    setIsConfirmDeletePostModalOpen(true);
                  }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setPostToEdit(post.post.id));
                    router.push("/post/edit");
                  }}
                >
                  Edit Post
                </Button>
              </div>
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

  const res = await Axios.post(`${process.env.SERVER_HOST}/posts/get_by_id`, {
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
