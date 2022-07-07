import React, { useState } from "react";
import { parseDate } from "../../../../functions/helpers/parseDate";
import { CommentWithVotesInterface } from "../postCommentSection";
import styles from "./comment.module.css";

import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import rangeParser from "parse-numeric-range";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("json", json);

interface Props {
  comment: CommentWithVotesInterface;
  allComments: CommentWithVotesInterface[];
}

const Comment = ({ comment, allComments }: Props): JSX.Element => {
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [downvoted, setDownvoted] = useState<boolean>(false);

  const MarkdownComponents: object = {
    code({ node, inline, className, ...props }: any) {
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
          style={oneDark}
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
    <div className={styles.container}>
      <div className={styles.votes_container}>
        <MdKeyboardArrowUp
          className={upvoted ? styles.upvote_icon_active : styles.upvote_icon}
        />
        <span>{comment.voteScore}</span>
        <MdKeyboardArrowDown
          className={
            downvoted ? styles.downvote_icon_active : styles.downvote_icon
          }
        />
      </div>
      <div>
        <p className={styles.comment_header}>
          {comment.comment.userName} -{" "}
          {parseDate({ date: comment.comment.createdAt })}
        </p>
        <ReactMarkdown
          components={MarkdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {comment.comment.comment}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Comment;
