import React, { useEffect, useState } from "react";
import styles from "./postCommentSection.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { toast } from "react-toastify";
import { Alert, Button, Spinner } from "react-bootstrap";
import Comment from "./comment/comment";

interface Props {
  postId: number;
}

export interface CommentWithVotesInterface {
  upvotes: number;
  downvotes: number;
  upvoted: boolean;
  downvoted: boolean;
  voteScore: number;
  comment: CommentInterface;
}

export interface CommentInterface {
  comment: string;
  createdAt: string;
  deleted: boolean;
  edited: boolean;
  id: number;
  postId: number;
  replyCommentId: number | null;
  replyUserId: number | null;
  replyUserName: string | null;
  updatedAt: string;
  userId: number;
  userName: string;
}

const PostCommentSection = ({ postId }: Props): JSX.Element => {
  const token = useAppSelector((state) => state.user.jwtToken);

  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [comments, setComments] = useState<CommentWithVotesInterface[] | null>(
    null
  );
  const [loadingPostComment, setLoadingPostComment] = useState(false);
  const [postCommentText, setPostCommentText] = useState("");

  const postComment = () => {
    setLoadingPostComment(true);

    Axios.post(
      "http://localhost:3001/posts/comment/create",
      { postId, comment: postCommentText },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        setPostCommentText("");
        toast.success("Comment posted!");
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoadingPostComment(false));
  };

  useEffect(() => {
    if (!loadingPostComment) {
      setIsLoadingComments(true);

      Axios.post(
        "http://localhost:3001/posts/comment/get_comments",
        { postId },
        {
          headers: {
            Authorization: token || "",
          },
        }
      )
        .then((response) => {
          setComments(response.data.comments);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setIsLoadingComments(false));
    }
  }, [postId, token, loadingPostComment]);

  const renderComments = () => {
    if (isLoadingComments)
      return (
        <>
          <Skeleton
            borderRadius={13}
            style={{ marginBottom: "10px" }}
            count={7}
            height={70}
          />
        </>
      );

    if (!comments) {
      return (
        <>
          <Alert variant="danger">
            There was an error loading the comments, please try again later
          </Alert>
        </>
      );
    }

    return (
      <>
        {comments.map((comment: CommentWithVotesInterface, index: number) => {
          return (
            <Comment comment={comment} allComments={comments} key={index} />
          );
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <h3>Comments:</h3>
      <hr></hr>
      <div className={styles.input_container}>
        <textarea
          onChange={(e) => setPostCommentText(e.target.value)}
          value={postCommentText}
          className={styles.text_input}
          placeholder="Write a comment! Tip: You can write comments using markdown language syntax."
        />

        <Button
          onClick={() => postComment()}
          className={
            postCommentText.length >= 1
              ? styles.post_comment_button
              : styles.post_comment_button_hidden
          }
        >
          {loadingPostComment ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
      <br></br>
      {renderComments()}
    </div>
  );
};

export default PostCommentSection;
