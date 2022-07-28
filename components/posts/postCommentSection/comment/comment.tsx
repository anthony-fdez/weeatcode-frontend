import { useMemo, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import { CommentWithVotesInterface } from "../postCommentSection";
import styles from "./comment.module.css";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import Axios from "axios";
import moment from "moment";
import Link from "next/link";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { downVoteComment } from "../../../../functions/crud/downvoteComment";
import { upVoteComment } from "../../../../functions/crud/upvoteComment";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import Markdown from "../../../markdown/markdown";
import ConfirmDeleteCommentModal from "../../confirmDeleteCommentModal/confirmDeleteCommentModal";

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
  const [isDeleteCommentOpen, setIsDeleteCommentOpen] = useState(false);

  const [editingComment, setEditingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  useMemo(() => {
    if (!comment) return;

    setUpVoted(comment.upVoted);
    setDownVoted(comment.downVoted);
    setCommentVoteScore(comment.voteScore);

    setNewComment(comment.comment.comment);
  }, [comment]);

  const postReply = () => {
    if (replyText === "") return toast.error("Empty comment");

    setLoadingPostReply(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/comment/create`,
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

  const postEdit = () => {
    setLoadingEdit(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/comment/edit`,
      {
        newComment,
        commentId: comment.comment.id,
      },
      {
        headers: {
          Authorization: user.jwtToken || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        setLoadingEdit(false);
        toast.success("Comment edited.");
        getNewComments();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Could not edit comment.");
      })
      .finally(() => {
        setLoadingEdit(false);
        setEditingComment(false);
      });
  };

  const commentReply = () => {
    if (editingComment) return null;

    if (!replyingToComment) {
      return (
        <div
          className={
            comment.comment.deleted
              ? styles.comment_buttons_disabled
              : styles.comment_buttons
          }
        >
          <div
            onClick={() => setReplyingToComment(true)}
            className={styles.reply_button}
          >
            <BsReply className={styles.reply_icon} />
            <span>Reply</span>
          </div>

          {comment.comment.userId === user.userId &&
            comment.comment.deleted === false && (
              <>
                <div
                  onClick={() => setEditingComment(true)}
                  className={styles.reply_button}
                >
                  <AiFillEdit className={styles.reply_icon} />
                  <span>Edit</span>
                </div>

                <div
                  onClick={() => {
                    setIsDeleteCommentOpen(true);
                  }}
                  className={styles.reply_button}
                >
                  <AiFillDelete className={styles.reply_icon} />
                  <span>Delete</span>
                </div>
              </>
            )}
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

    return (
      <div className={styles.comment_body}>
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
      <ConfirmDeleteCommentModal
        commentId={comment.comment.id}
        isOpen={isDeleteCommentOpen}
        handleClose={() => setIsDeleteCommentOpen(false)}
        getNewComments={getNewComments}
      />
      <div
        className={
          comment.comment.deleted
            ? styles.votes_disabled
            : styles.votes_container
        }
      >
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
          <Link passHref href={`/profile/${comment.comment.userId}`}>
            <a>{comment.comment.userName}</a>
          </Link>{" "}
          - {moment(comment.comment.createdAt).fromNow()}
          {comment.comment.edited && (
            <span className={styles.edited_tag}>
              Edited {moment(comment.comment.updatedAt).fromNow()}
            </span>
          )}
        </p>
        <div
          className={
            comment.comment.edited ? styles.edited_margin_top : styles.test
          }
        >
          {editingComment ? (
            <div className={styles.write_reply}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Reply to ${comment.comment.userName}`}
                rows={1}
                className={styles.reply_text_area}
              />
              <Button
                onClick={() => postEdit()}
                className={styles.post_reply_button}
              >
                {loadingEdit ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <>
                    <span>Confirm Edit</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Markdown markdownText={comment.comment.comment} />
          )}
        </div>
        {commentReply()}
        <RenderCommentReplies />
      </div>
    </div>
  );
};

export default Comment;
