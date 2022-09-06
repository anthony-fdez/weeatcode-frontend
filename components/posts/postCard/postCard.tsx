import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { PostInterface } from "../../../interfaces/PostInterface";
import styles from "./postCard.module.css";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import Link from "next/link";
import { upVotePost } from "../../../functions/crud/upvotePost";
import { downVotePost } from "../../../functions/crud/downvotePost";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import Markdown from "../../markdown/markdown";
import moment from "moment";

// Code highlighting
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

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
    hljs.initHighlighting();

    // @ts-ignore
    setHeight(ref.current.clientHeight);
  }, []);

  useEffect(() => {
    if (!post) return;

    if (post.upVoted) setUpVoted(true);
    if (post.downVoted) setDownVoted(true);

    setPostVoteScore(post.voteScore);
  }, [post]);

  const EditedTag = (): JSX.Element | null => {
    if (!post.post.edited) return null;

    return <div className={styles.edited_tag}>Edited</div>;
  };

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
            <div className={styles.card_header}>
              <p>
                <Link href={`/profile/${post.post.authorId}`}>
                  <a>{post.post.authorName}</a>
                </Link>{" "}
                <br></br>
                <span style={{ opacity: 0.7 }}>
                  {moment(post.post.createdAt).fromNow()}
                </span>
              </p>
              <EditedTag />
            </div>

            <h2>{post.post.title}</h2>
          </div>
          <div>
            <div
              className="ProseMirror"
              dangerouslySetInnerHTML={{ __html: post.post.body }}
            />
          </div>
        </div>
      </Link>
      {height === 500 && <div className={styles.bottom_fade}></div>}
    </div>
  );
};

export default PostCard;
