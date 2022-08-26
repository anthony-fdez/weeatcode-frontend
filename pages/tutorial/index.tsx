/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import React from "react";
import Markdown from "../../components/markdown/markdown";
import styles from "./tutorial.module.css";

const Tutorial: NextPage = () => {
  const codeExample1 = `
\`\`\`tsx
const Markdown = ({ markdownText }: Props): JSX.Element => {
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
    <div className={styles.markdown_container}>
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};
\`\`\`
`;

  return (
    <main>
      <div className={styles.container}>
        <h1>Welcome to WeEatCode</h1>
        <p className={styles.smaller_darker}>
          Where we all eat code, not literally... ofc
        </p>
        <br></br>
        <p>
          First things first right. In this little article we&apos;ll show you
          how to use this blog, how to posts things, and what can you do with
          it. Of course this is just a hobby project, there are several better
          blogs out there. With that being said...
        </p>
        <br></br>
        <h2>No ads, never!</h2>
        <p>
          Yep, we are never going to put ads an this site, its not like it would
          ever be profitable, even with ads...
        </p>
        <br></br>
        <h2>Open source!</h2>
        <p>
          The codebase for the entire website is open source, both backend and
          the frontend. If you are a programmer who is feeling a little
          adventurous go ahead and contribute to the project!
        </p>
        <p>Github repos:</p>
        <ul>
          <li>
            Frontend:{" "}
            <a
              target="_blank"
              href="https://github.com/anthony-fdez/blog-node-frontend"
              rel="noreferrer"
            >
              https://github.com/anthony-fdez/blog-node-frontend
            </a>{" "}
          </li>
          <li>
            Backend:{" "}
            <a
              rel="noreferrer"
              href="https://github.com/anthony-fdez/blog-node"
              target="_blank"
            >
              https://github.com/anthony-fdez/blog-node
            </a>{" "}
          </li>
        </ul>
        <br></br>
        <h2>How posts are written?</h2>
        <p>
          Good question... easy! Using{" "}
          <a
            rel="noreferrer"
            href="https://www.markdownguide.org/getting-started/"
            target="_blank"
          >
            Markdown Language
          </a>
        </p>
        <p>
          You can learn all you need to know about markdown language and how to
          write not only posts in this site, but a lot of other things using it.
        </p>
        <br></br>
        <p>
          You can also create code blocks to show any code snippet you want, you
          do this the markdown way. To just have a line of code highlighted you
          use one backtick "`" to open it, and another one to close it.
        </p>
        <Markdown markdownText="`console.log('This is a code example');`" />
        <br></br>
        <p>
          To make a codeblock you use three backticks instead of one, and put
          the language you are using right after the first three backticks. For
          example: ```js would start a js code block.
        </p>
        <br></br>
        <p>And it would look something like this:</p>
        <Markdown markdownText={codeExample1} />
        <p>
          If you are curious about what the code on top does, you are looking at
          the code that shows the code that you are seeing... lol. Pretty much
          the code that renders the markdown language and does the code
          highlighting.
        </p>
        <br></br>
        <p>And that is all for now. Cheers</p>
      </div>
    </main>
  );
};

export default Tutorial;
