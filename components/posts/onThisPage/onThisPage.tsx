import { number } from "prop-types";
import React, { useEffect, useState } from "react";
import styles from "./onThisPage.module.css";

interface Link {
  text: string;
  element: HTMLHeadingElement;
}

const OnThisPage = () => {
  const [links, setLinks] = useState<Link[] | null>(null);

  useEffect(() => {
    const doc = document.getElementById("post")?.getElementsByTagName("h2");

    const items: Link[] = [];

    if (doc) {
      if (doc.length === 0) return;

      for (let i = 0; i < doc.length; i++) {
        const item = doc[i];

        items.push({
          text: item.innerText,
          element: item,
        });
      }

      setLinks(items);
    }
  }, []);

  if (!links) return null;

  return (
    <>
      <div className={styles.container}>
        <h4 className={styles.header}>On this page</h4>
        <ul className={styles.list}>
          {links.map((link: Link, index: number) => {
            return (
              <li
                onClick={() => {
                  window.scrollTo(0, link.element.offsetTop - 60);
                }}
                key={`Link Element ${index}`}
              >
                {link.text}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default OnThisPage;
