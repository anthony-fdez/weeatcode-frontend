import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
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
import { NextSeo } from "next-seo";
import Editor from "../../components/editor/editor";

const Post: NextPage = () => {
  const router = useRouter();

  const token = useAppSelector((state) => state.user.jwtToken);

  const [title, setTitle] = useState<string | null>(null);
  const [markdownText, setMarkDownText] = useState<string | null>(null);
  const [loadingCreatingPost, setLoadingCreatingPost] =
    useState<boolean>(false);

  useEffect(() => {
    const storageMarkdownText = localStorage.getItem("markdownText");
    const storagePostTitle = localStorage.getItem("postTitle");

    if (storageMarkdownText) {
      setMarkDownText(storageMarkdownText.slice(1, -1));
    }

    if (storagePostTitle) {
      setTitle(storagePostTitle.slice(1, -1));
    }
  }, []);

  const handleChangeMarkdownText = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMarkDownText(e.target.value);

    localStorage.setItem("markdownText", JSON.stringify(e.target.value));
  };

  useEffect(() => {}, [markdownText]);

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
        toast.success("Post created");

        router.push(`/post/${response.data.post.id}`);
      })
      .catch((err) => {
        toast.error(
          "Unable to upload your post at the moment, try again later."
        );
      })
      .finally(() => {
        setLoadingCreatingPost(false);
        localStorage.setItem("markdownText", "");
        localStorage.setItem("postTitle", "");
      });
  };

  return (
    <>
      <NextSeo title={`Create A Post - WeEatCode`} />

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
        <div>
          <Editor />
        </div>
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
