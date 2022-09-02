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

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
// load all highlight.js languages
import lowlight from "lowlight";
import CodeBlock from "../../components/editor/codeBlock/codeBlock";
import StarterKit from "@tiptap/starter-kit";
import Menu from "../../components/editor/menu/menu";

const Post: NextPage = () => {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.jwtToken);

  const [title, setTitle] = useState<string | null>(null);
  const [markdownText, setMarkDownText] = useState<string | null>(null);
  const [loadingCreatingPost, setLoadingCreatingPost] =
    useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
      }).configure({ lowlight }),
    ],
    content: markdownText,
  });

  useEffect(() => {
    const storageMarkdownText = localStorage.getItem("markdownText");
    const storagePostTitle = localStorage.getItem("postTitle");

    if (storageMarkdownText && editor) {
      setMarkDownText(storageMarkdownText);
      editor.commands.setContent(storageMarkdownText);
    }

    if (storagePostTitle) {
      setTitle(storagePostTitle.slice(1, -1));
    }
  }, [editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("saved");
      console.log(editor?.getHTML());
      localStorage.setItem("markdownText", editor?.getHTML() || "");
    }, 5000);

    return () => clearInterval(interval);
  }, [editor]);

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
          <input
            type="text"
            value={title || ""}
            onChange={(e) => {
              localStorage.setItem("postTitle", JSON.stringify(e.target.value));
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
