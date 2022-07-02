import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { PostInterface } from "../../../pages";
import styles from "./postCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Link from "next/link";
import { upvotePost } from "../../../functions/crud/upvotePost";
import { downvotePost } from "../../../functions/crud/downvotePost";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";

interface Props {
  post: PostInterface;
}

const PostCard = ({ post }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLogedIn = useAppSelector((state) => state.askToLoginPopup.isOpen);

  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [downvoted, setDownvoted] = useState<boolean>(false);
  const [postVoteScore, setPostVoteScore] = useState<number>(0);

  useEffect(() => {
    if (!post) return;

    if (post.upvoted) setUpvoted(true);
    if (post.downvoted) setDownvoted(true);

    setPostVoteScore(post.voteScore);
  }, [post]);

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
          onClick={() =>
            upvotePost({
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
