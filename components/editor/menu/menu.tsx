import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./menu.module.css";

// icons
import { FaBold } from "react-icons/fa";
import { AiOutlineItalic } from "react-icons/ai";
import { MdFormatStrikethrough } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { BsTextParagraph } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import { GoQuote } from "react-icons/go";
import { MdHorizontalRule } from "react-icons/md";
import { AiOutlineEnter } from "react-icons/ai";
import { BiUndo } from "react-icons/bi";
import { BiRedo } from "react-icons/bi";

interface Props {
  editor: Editor | null;
}

const Menu = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <AiOutlineItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <MdFormatStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          >
            <BsCodeSlash />
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          >
            <BsTextParagraph />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            H3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }
          >
            H4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={
              editor.isActive("heading", { level: 5 }) ? "is-active" : ""
            }
          >
            H5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <MdFormatListBulleted />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            <AiOutlineOrderedList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "is-active" : ""}
          >
            <BiCodeBlock />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          >
            <GoQuote />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <MdHorizontalRule />
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()}>
            <AiOutlineEnter />
          </button>
          <button onClick={() => editor.chain().focus().undo().run()}>
            <BiUndo />
          </button>
          <button onClick={() => editor.chain().focus().redo().run()}>
            <BiRedo />
          </button>
        </div>
      </div>
    </>
    // <button
    //   onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    //   className={editor.isActive("codeBlock") ? "is-active" : ""}
    // >
    //   code block
    // </button>
  );
};

export default Menu;
