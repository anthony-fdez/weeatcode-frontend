import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";

import Menu from "./menu/menu";
import styles from "./editor.module.css";
import BubbleMenuComponent from "./bubbleMenu/bubbleMenu";

const Editor = ({ editor }: { editor: any | null }) => {
  return (
    <div>
      <BubbleMenuComponent editor={editor} />
      <Menu editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default Editor;
