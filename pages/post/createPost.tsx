import { NextPage, NextPageContext } from "next";
import { useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./createPost.module.css";

import Axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import MarkdownTutorial from "../../components/posts/markdownTutorial/markdownTutorial";
import { useAppSelector } from "../../redux/hooks/hooks";
import Markdown from "../../components/markdown/markdown";

const Post: NextPage = () => {
  const router = useRouter();

  const token = useAppSelector((state) => state.user.jwtToken);

  const [title, setTitle] = useState<string | null>(null);
  const [markdownText, setMarkDownText] = useState<string | null>(null);
  const [loadingCreatingPost, setLoadingCreatingPost] =
    useState<boolean>(false);

  const submitPost = () => {
    if (!title) return toast.error("Please add a title to your post");
    if (!markdownText) return toast.error("Please add the body of your post");

    setLoadingCreatingPost(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/create_post`,
      { title: title, body: markdownText },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        toast.success("Post created");

        router.push(`/post/${response.data.post.id}`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoadingCreatingPost(false));
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.header}>
          <h5>Create new post</h5>
          <Button style={{ width: "120px" }} onClick={() => submitPost()}>
            {loadingCreatingPost ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
        <br></br>
        <div className={styles.content_container}>
          <div className={styles.input_container}>
            <input
              type="text"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title of your post here"
              className={styles.title_input}
            />
            <textarea
              value={markdownText || ""}
              onChange={(e) => setMarkDownText(e.target.value)}
              placeholder="Write your post here"
              rows={30}
              className={styles.input}
            />
          </div>

          <div className={styles.post_preview}>
            <h4>Post Preview:</h4>
            <hr></hr>

            {markdownText ? (
              <>
                <h1>{title || "'Title'"}</h1>
                <br></br>
                <Markdown markdownText={markdownText} />
              </>
            ) : (
              <Alert>Your post preview will appear here.</Alert>
            )}
            <br></br>
            <hr></hr>
            <h5>Scroll down to learn how to write a bad ass post!</h5>
          </div>
        </div>
        <MarkdownTutorial />
      </main>
    </>
  );
};

export async function getStaticProps(context: NextPageContext) {
  return {
    props: {
      protected: true,
    },
  };
}

export default Post;
