import { useEffect, useMemo, useState } from "react";
import { parseDate } from "../../../../functions/helpers/parseDate";
import { CommentWithVotesInterface } from "../postCommentSection";
import styles from "./comment.module.css";
import { BsReply } from "react-icons/bs";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { downVoteComment } from "../../../../functions/crud/downvoteComment";
import { upVoteComment } from "../../../../functions/crud/upvoteComment";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import Markdown from "../../../markdown/markdown";
import moment from "moment";
import { Button, Spinner } from "react-bootstrap";
import Axios from "axios";
import { toast } from "react-toastify";

interface Props {
  comment: CommentWithVotesInterface;
  allComments: CommentWithVotesInterface[];
  getNewComments: Function;
}

const Comment = ({
  comment,
  allComments,
  getNewComments,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [upVoted, setUpVoted] = useState<boolean>(false);
  const [downVoted, setDownVoted] = useState<boolean>(false);
  const [commentVoteScore, setCommentVoteScore] = useState<number>(0);

  const [replyingToComment, setReplyingToComment] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loadingPostReply, setLoadingPostReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  useMemo(() => {
    if (!comment) return;

    setUpVoted(comment.upVoted);
    setDownVoted(comment.downVoted);
    setCommentVoteScore(comment.voteScore);
  }, [comment]);

  const postReply = () => {
    setLoadingPostReply(true);

    Axios.post(
      "http://localhost:3001/posts/comment/create",
      {
        postId: comment.comment.postId,
        comment: replyText,
        replyCommentId: comment.comment.id,
        replyUserName: comment.comment.userName,
        replyUserId: comment.comment.userId,
      },
      {
        headers: {
          Authorization: user.jwtToken || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        setReplyingToComment(false);
        toast.success("Reply posted.");
        getNewComments();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Could not post reply.");
      })
      .finally(() => {
        setLoadingPostReply(false);
      });
  };

  const commentReply = () => {
    if (!replyingToComment) {
      return (
        <div
          onClick={() => setReplyingToComment(true)}
          className={styles.reply_button}
        >
          <BsReply className={styles.reply_icon} />
          <span>Reply</span>
        </div>
      );
    }

    return (
      <div className={styles.write_reply}>
        <textarea
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Reply to ${comment.comment.userName}`}
          rows={1}
          className={styles.reply_text_area}
        />
        <Button
          onClick={() => postReply()}
          className={styles.post_reply_button}
        >
          {loadingPostReply ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <>
              <BsReply className={styles.reply_icon} />
              <span>Reply</span>
            </>
          )}
        </Button>
      </div>
    );
  };

  const RenderCommentReplies = (): JSX.Element | null => {
    if (!allComments) return null;

    const replies: CommentWithVotesInterface[] = [];

    allComments.forEach((reply: CommentWithVotesInterface, index: number) => {
      if (reply.comment.replyCommentId === comment.comment.id) {
        replies.push(reply);
      }
    });

    if (replies.length <= 0) return null;

    // if (!showReplies) {
    //   return (
    //     <div onClick={() => setShowReplies(true)}>
    //       <span>See replies</span>
    //     </div>
    //   );
    // }

    return (
      <div style={{ marginTop: "20px" }}>
        {replies.map((reply, index) => {
          return (
            <Comment
              getNewComments={getNewComments}
              comment={reply}
              key={index}
              allComments={allComments}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.votes_container}>
        <MdKeyboardArrowUp
          onClick={() =>
            upVoteComment({
              commentId: comment.comment.id,
              token: user.jwtToken,
              setCommentVoteScore,
              upVoted,
              downVoted,
              setUpVoted,
              setDownVoted,
              dispatch,
              isLoggedIn: user.isLoggedIn,
              getNewComments,
            })
          }
          className={upVoted ? styles.upVote_icon_active : styles.upVote_icon}
        />
        <span>{commentVoteScore}</span>
        <MdKeyboardArrowDown
          onClick={() =>
            downVoteComment({
              commentId: comment.comment.id,
              token: user.jwtToken,
              setCommentVoteScore,
              upVoted,
              downVoted,
              setUpVoted,
              setDownVoted,
              dispatch,
              isLoggedIn: user.isLoggedIn,
              getNewComments,
            })
          }
          className={
            downVoted ? styles.downVote_icon_active : styles.downVote_icon
          }
        />
      </div>
      <div className={styles.content_container}>
        <p className={styles.comment_header}>
          {comment.comment.userName} -{" "}
          {moment(comment.comment.createdAt).fromNow()}
        </p>
        <div className={styles.markdown_container}>
          <Markdown markdownText={comment.comment.comment} />
        </div>
        {commentReply()}
        <RenderCommentReplies />
      </div>
    </div>
  );
};

export default Comment;
