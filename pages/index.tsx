/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import { Alert, Button } from "react-bootstrap";
import PostCard from "../components/posts/postCard/postCard";
import { useAppSelector } from "../redux/hooks/hooks";
import { PostInterface } from "../interfaces/PostInterface";
import { setisLoggedIn } from "../redux/slices/user";
import { toast } from "react-toastify";
import { NextSeo } from "next-seo";

const Home: NextPage = () => {
  const token = useAppSelector((state) => state.user.jwtToken);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const [posts, setPosts] = useState<PostInterface[] | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedPage, setSelectedPage] = useState(1);

  useEffect(() => {
    setIsLoadingPosts(true);
    window.scrollTo(0, 0);

    if (selectedTab === "following" && !isLoggedIn) {
      setIsLoadingPosts(false);
      return;
    }

    Axios.get(
      selectedTab === "all"
        ? `${process.env.SERVER_HOST}/posts/get_all?page=${selectedPage}`
        : `${process.env.SERVER_HOST}/posts/get_all_following?page=${selectedPage}`,
      {
        headers: { Authorization: token || "" },
      }
    )
      .then((response) => {
        setIsLoadingPosts(false);
        setPosts(response.data.posts);
      })
      .catch((e) => {
        setIsLoadingPosts(false);
        toast.error("There was an error getting the posts at the moment.");
      });
  }, [selectedTab, selectedPage]);

  useEffect(() => {
    setIsLoadingPosts(true);
    setSelectedPage(1);
  }, [selectedTab]);

  useEffect(() => {
    if (!posts) return;

    if (posts.length <= 0 && selectedPage !== 1) {
      setSelectedPage((page) => (page = page - 1));
      toast.error("There are no more pages.");
    }
  }, [posts]);

  const renderPostsCards = (): JSX.Element => {
    if (selectedTab === "following" && !isLoggedIn) {
      return (
        <main className={styles.container}>
          <p>You are not logged in.</p>
        </main>
      );
    }

    if (isLoadingPosts) {
      return (
        <>
          <Skeleton
            style={{ marginBottom: "10px" }}
            borderRadius={13}
            count={10}
            height={150}
          />
        </>
      );
    }

    if (!posts) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Error.</Alert.Heading>
          <p>We are unable to load posts at this time</p>
        </Alert>
      );
    }

    if (posts.length <= 0) {
      return (
        <div className={styles.empty}>
          <img
            className={styles.image}
            src="/illustrations/empty.svg"
            alt="Empty"
          />
          <h1>So empty...</h1>
          <p>Check back later for more posts or post your own one!</p>
        </div>
      );
    }

    return (
      <>
        {posts.map((post: PostInterface, index: number) => {
          return <PostCard key={index} post={post} />;
        })}
        <div className={styles.footer}>
          <Button
            variant="outline-primary"
            onClick={() => {
              setSelectedPage((page) => (page = page - 1));
            }}
            disabled={selectedPage === 1}
          >
            Prev
          </Button>
          <span style={{ minWidth: "50px", textAlign: "center" }}>
            Page {selectedPage}
          </span>
          <Button
            variant="outline-primary"
            onClick={() => {
              setSelectedPage((page) => (page = page + 1));
            }}
          >
            Next
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <NextSeo
        title={`WeEatCode`}
        description={"Blog WeEatCode, where we all eat code"}
      />

      <main className={styles.container}>
        <div className={styles.tabs_container}>
          <h3
            onClick={() => setSelectedTab("all")}
            className={
              selectedTab === "all" ? styles.active_tab : styles.inactive_tab
            }
          >
            All Posts
          </h3>
          <h3
            onClick={() => setSelectedTab("following")}
            className={
              selectedTab === "following"
                ? styles.active_tab
                : styles.inactive_tab
            }
          >
            Following
          </h3>
        </div>

        <div className={styles.posts_container}>{renderPostsCards()}</div>
      </main>
    </div>
  );
};

export default Home;
