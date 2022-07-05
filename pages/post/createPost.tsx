import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import styles from "./createPost.module.css";
import ReactMarkdown from "react-markdown";
import { Alert } from "react-bootstrap";
import remarkGfm from "remark-gfm";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";

import rangeParser from "parse-numeric-range";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

const Post: NextPage = () => {
  const syntaxTheme = oneDark;

  const [text, setText] = useState<string | null>(null);

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const hasMeta = node?.data?.meta;

      const applyHighlights: object = (applyHighlights: number) => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, "");
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)[1]
            : "0";
          const highlightLines = rangeParser(strlineNumbers);
          const highlight = highlightLines;
          const data: string = highlight.includes(applyHighlights)
            ? "highlight"
            : null;
          return { data };
        } else {
          return {};
        }
      };

      return match ? (
        <SyntaxHighlighter
          style={syntaxTheme}
          language={match[1]}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          wrapLines={hasMeta ? true : false}
          useInlineStyles={true}
          lineProps={applyHighlights}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  return (
    <>
      <main className={styles.container}>
        <h1>Create new post</h1>
        <hr></hr>
        <div className={styles.content_container}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your post here"
            rows={30}
            className={styles.input}
          />
          <div className={styles.post_preview}>
            <h4>Post Preview:</h4>
            <hr></hr>
            {text ? (
              <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {text}
              </ReactMarkdown>
            ) : (
              <Alert>Your post preview will appear here.</Alert>
            )}
            <br></br>
            <hr></hr>
            <h5>How to write a bad ass post?</h5>
          </div>
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
