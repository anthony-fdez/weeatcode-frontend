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
import { useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Text from "@tiptap/extension-text";
import CodeBlock from "../../components/editor/codeBlock/codeBlock";
import lowlight from "lowlight";
import Editor from "../../components/editor/editor";

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Link.configure({
        openOnClick: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your post here...",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
      }).configure({ lowlight }),
    ],
    content: markdownText,
  });

  useEffect(() => {
    if (!postToEdit) return;
    if (!editor) return;

    setLoadingGettingPost(true);

    Axios.post(`${process.env.SERVER_HOST}/posts/get_by_id`, {
      postId: postToEdit,
    })
      .then((response) => {
        setTitle(response.data.post.title);
        setMarkDownText(response.data.post.body);
        setErrorLoadingData(false);

        if (editor) {
          editor.commands.setContent(response.data.post.body);
        }
      })
      .catch((e) => {
        setErrorLoadingData(true);
      })
      .finally(() => {
        setLoadingGettingPost(false);
      });
  }, [postToEdit, editor]);

  const submitPost = () => {
    if (!title) return toast.error("Please add a title to your post");
    if (!markdownText) return toast.error("Please add the body of your post");

    setLoadingCreatingPost(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/edit`,
      { postId: postToEdit, title: title, body: editor?.getHTML() },
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
          <Button style={{ width: "150px" }} onClick={() => submitPost()}>
            {loadingCreatingPost ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
        <br></br>
        <div>
          <input
            type="text"
            value={title || ""}
            onChange={(e) => {
              localStorage.setItem(
                "postTitleEdit",
                JSON.stringify(e.target.value)
              );
              setTitle(e.target.value);
            }}
            placeholder="Enter the title of your post here"
            className={styles.title_input}
          />
          <Editor editor={editor} />
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
