import React from "react";
import { Alert } from "react-bootstrap";
import { PostInterface } from "../../../pages";
import styles from "./postCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";

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

  const upvote = () => {
    alert("upvote");
  };

  const downvote = () => {
    alert("downvote");
  };

  const openPost = () => {
    alert("open post");
  };

  return (
    <div className={styles.container}>
      <div className={styles.votes_container}>
        <MdKeyboardArrowUp onClick={upvote} className={styles.upvote_icon} />
        <span>{post.voteScore}</span>
        <MdKeyboardArrowDown
          onClick={downvote}
          className={styles.downvote_icon}
        />
      </div>
      <div onClick={openPost} className={styles.post_content}>
        <div className={styles.post_header}>
          <h4>{post.post.title}</h4>
        </div>
        <div className={styles.post_}>
          <p>{post.post.body}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
