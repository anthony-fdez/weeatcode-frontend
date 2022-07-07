import React, { useEffect, useState } from "react";
import styles from "./postCommentSection.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { toast } from "react-toastify";
import { Alert } from "react-bootstrap";
import Comment from "./comment/comment";

interface Props {
  postId: number;
}

export interface CommentWithVotesInterface {
  upvotes: number;
  downvotes: number;
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

  useEffect(() => {
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
  }, [postId, token]);

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
      {renderComments()}
    </div>
  );
};

export default PostCommentSection;
