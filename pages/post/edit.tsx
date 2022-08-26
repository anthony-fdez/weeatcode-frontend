/* eslint-disable @next/next/no-img-element */
import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import styles from "./createPost.module.css";

import Axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Markdown from "../../components/markdown/markdown";
import MarkdownTutorial from "../../components/posts/markdownTutorial/markdownTutorial";
import { useAppSelector } from "../../redux/hooks/hooks";
import { kMaxLength } from "buffer";
import Skeleton from "react-loading-skeleton";
import { NextSeo } from "next-seo";

const Post: NextPage = () => {
  const router = useRouter();

  const token = useAppSelector((state) => state.user.jwtToken);
  const postToEdit = useAppSelector((state) => state.postToEdit.postId);

  const [title, setTitle] = useState<string | null>(null);
  const [markdownText, setMarkDownText] = useState<string | null>(null);
  const [loadingCreatingPost, setLoadingCreatingPost] =
    useState<boolean>(false);
  const [loadingGettingPost, setLoadingGettingPost] = useState(false);
  const [errorLoadingData, setErrorLoadingData] = useState(false);

  useEffect(() => {
    if (!postToEdit) return;

    setLoadingGettingPost(true);

    Axios.post(`${process.env.SERVER_HOST}/posts/get_by_id`, {
      postId: postToEdit,
    })
      .then((response) => {
        setTitle(response.data.post.title);
        setMarkDownText(response.data.post.body);
        setErrorLoadingData(false);
      })
      .catch((e) => {
        setErrorLoadingData(true);
      })
      .finally(() => {
        setLoadingGettingPost(false);
      });
  }, [postToEdit]);

  const submitPost = () => {
    if (!title) return toast.error("Please add a title to your post");
    if (!markdownText) return toast.error("Please add the body of your post");

    setLoadingCreatingPost(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/edit`,
      { postId: postToEdit, title: title, body: markdownText },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        toast.success("Post edited");

        router.push(`/post/${postToEdit}`);
      })
      .catch((err) => {})
      .finally(() => setLoadingCreatingPost(false));
  };

  if (loadingGettingPost) {
    return (
      <main className={styles.container}>
        <Skeleton height={70} borderRadius={13} />
        <br></br>
      </main>
    );
  }

  if (errorLoadingData) {
    return (
      <main className={styles.container}>
        <div>
          <img
            alt="Error"
            className={styles.error_image}
            src="/illustrations/server_error.svg"
          />
        </div>
        <br></br>
        <h2>There was an error loading the post to edit.</h2>
        <p>Please try again in a few minutes</p>
      </main>
    );
  }

  return (
    <>
      <NextSeo title={`Edit A Post - WeEatCode`} />

      <main className={styles.container}>
        <div className={styles.header}>
          <h5>Edit your post</h5>
          <Button style={{ width: "120px" }} onClick={() => submitPost()}>
            {loadingCreatingPost ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Edit Post"
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
