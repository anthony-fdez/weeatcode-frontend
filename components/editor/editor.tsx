import { EditorContent, useEditor } from "@tiptap/react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { ReactNodeViewRenderer } from "@tiptap/react";
// load all highlight.js languages
import lowlight from "lowlight";
import CodeBlock from "./codeBlock/codeBlock";
import Menu from "./menu/menu";
import styles from "./editor.module.css";
import StarterKit from "@tiptap/starter-kit";

const Editor = () => {
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
    content: `
        <div>
          <h1>Start here!</h1>
         <p>
          Delete this sentence and start writing your post!
          </p>
        <div>
      `,
  });

  return (
    <div>
      <Menu editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default Editor;
