import { useEffect, useState } from "react";
import { parseDate } from "../../../../functions/helpers/parseDate";
import { CommentWithVotesInterface } from "../postCommentSection";
import styles from "./comment.module.css";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

import { downVoteComment } from "../../../../functions/crud/downvoteComment";
import { upVoteComment } from "../../../../functions/crud/upvoteComment";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import Markdown from "../../../markdown/markdown";

interface Props {
  comment: CommentWithVotesInterface;
  allComments: CommentWithVotesInterface[];
}

const Comment = ({ comment, allComments }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [upVoted, setUpVoted] = useState<boolean>(false);
  const [downVoted, setDownVoted] = useState<boolean>(false);
  const [commentVoteScore, setCommentVoteScore] = useState<number>(0);

  useEffect(() => {
    if (!comment) return;

    setUpVoted(comment.upVoted);
    setDownVoted(comment.downVoted);
    setCommentVoteScore(comment.voteScore);
  }, [comment]);

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
          {parseDate({ date: comment.comment.createdAt })}
        </p>
        <div className={styles.markdown_container}>
          <Markdown markdownText={comment.comment.comment} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
