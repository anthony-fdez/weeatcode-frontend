import { EditorContent, useEditor } from "@tiptap/react";

import Menu from "./menu/menu";
import styles from "./editor.module.css";

const Editor = ({ editor }: { editor: any | null }) => {
  return (
    <div>
      <Menu editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default Editor;
