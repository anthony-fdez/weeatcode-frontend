import { Editor } from "@tiptap/react";
import React from "react";

interface Props {
  editor: Editor | null;
}

const Menu = ({ editor }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <button
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      className={editor.isActive("codeBlock") ? "is-active" : ""}
    >
      code block
    </button>
  );
};

export default Menu;
