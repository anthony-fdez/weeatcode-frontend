import React from "react";
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
          onClick={upvotePost}
          className={styles.upvote_icon}
        />
        <span>{post.voteScore}</span>
        <MdKeyboardArrowDown
          onClick={downvotePost}
          className={styles.downvote_icon}
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
