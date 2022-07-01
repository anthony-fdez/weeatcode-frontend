import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { PostInterface } from "../../../pages";
import styles from "./postCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Link from "next/link";
import { upvotePost } from "../../../functions/crud/upvotePost";
import { downvotePost } from "../../../functions/crud/downvotePost";

interface Props {
  post: PostInterface;
}

const PostCard = ({ post }: Props): JSX.Element => {
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [downvoted, setDownvoted] = useState<boolean>(false);
  const [postVoteScore, setPostVoteScore] = useState<number>(0);

  useEffect(() => {
    if (!post) return;

    if (post.upvoted) setUpvoted(true);
    if (post.downvoted) setDownvoted(true);

    setPostVoteScore(post.voteScore);
  }, [post]);

  const upvote = () => {
    if (upvoted) {
      setUpvoted(false);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore - 1));
    } else if (downvoted) {
      setUpvoted(true);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore + 2));
    } else {
      setUpvoted(true);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore + 1));
    }
    setDownvoted(false);
  };

  const downvote = () => {
    if (downvoted) {
      setDownvoted(false);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore + 1));
    } else if (upvoted) {
      setDownvoted(true);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore - 2));
    } else {
      setDownvoted(true);
      setPostVoteScore((postVoteScore) => (postVoteScore = postVoteScore - 1));
    }
    setUpvoted(false);
  };

  if (!post) {
    return (
      <div className={styles.container}>
        <p>Post unavailable</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.votes_container}>
        <MdKeyboardArrowUp
          onClick={upvote}
          className={upvoted ? styles.upvote_icon_active : styles.upvote_icon}
        />
        <span>{postVoteScore}</span>
        <MdKeyboardArrowDown
          onClick={downvote}
          className={
            downvoted ? styles.downvote_icon_active : styles.downvote_icon
          }
        />
      </div>
      <Link passHref href={`/post/${post.post.id}`}>
        <div className={styles.post_content}>
          <div className={styles.post_header}>
            <h4>{post.post.title}</h4>
          </div>
          <div className={styles.post_}>
            <p className="clamped-text">{post.post.body}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
