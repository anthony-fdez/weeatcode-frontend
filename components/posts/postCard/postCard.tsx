import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { PostInterface } from "../../../pages";
import styles from "./postCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Link from "next/link";
import { upVotePost } from "../../../functions/crud/upvotePost";
import { downVotePost } from "../../../functions/crud/downvotePost";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import Markdown from "../../markdown/markdown";

interface Props {
  post: PostInterface;
}

const PostCard = ({ post }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const ref = useRef(null);

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const token = useAppSelector((state) => state.user.jwtToken);

  const [height, setHeight] = useState(0);

  const [upVoted, setUpVoted] = useState<boolean>(false);
  const [downVoted, setDownVoted] = useState<boolean>(false);
  const [postVoteScore, setPostVoteScore] = useState<number>(0);

  useEffect(() => {
    // @ts-ignore
    setHeight(ref.current.clientHeight);
  }, []);

  console.log(height);

  useEffect(() => {
    if (!post) return;

    if (post.upVoted) setUpVoted(true);
    if (post.downVoted) setDownVoted(true);

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
    <div ref={ref} className={styles.container}>
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
      <Link passHref href={`/post/${post.post.id}`}>
        <div className={styles.post_content}>
          <div className={styles.post_header}>
            <h4>{post.post.title}</h4>
          </div>
          <div>
            <Markdown markdownText={post.post.body} />
            {/* <p className="clamped-text">{post.post.body}</p> */}
          </div>
        </div>
      </Link>
      {height === 500 && <div className={styles.bottom_fade}></div>}
    </div>
  );
};

export default PostCard;
