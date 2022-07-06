import React from "react";
import { Table } from "react-bootstrap";
import styles from "./markdownTutorial.module.css";

const MarkdownTutorial = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <h1>How to write a post</h1>
      <hr></hr>
      <p>
        To compose a post you need to do it using{" "}
        <a
          target="_blank"
          href="https://www.markdownguide.org/getting-started/"
          rel="noreferrer"
        >
          markdown language
        </a>
        .
      </p>
      <br></br>
      <p>
        Markdown is a plain text formatting syntax aimed at making writing for
        the internet easier. The philosophy behind Markdown is that plain text
        documents should be readable without tags mussing everything up, but
        there should still be ways to add text modifiers like lists, bold,
        italics, etc. It is an alternative to WYSIWYG (what you see is what you
        get) editors, which use rich text that later gets converted to proper
        HTML.
      </p>
      <br></br>
      <h3>Learn markdown language</h3>
      <hr></hr>
      <p>Outside sources and references</p>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://www.markdownguide.org/"
            rel="noreferrer"
          >
            Markdown Official Guide
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.markdownguide.org/cheat-sheet/"
            rel="noreferrer"
          >
            Markdown Cheatsheet
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://www.markdownguide.org/cheat-sheet/"
            rel="noreferrer"
          >
            Github&apos;s Markdown Cheatsheet
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MarkdownTutorial;
