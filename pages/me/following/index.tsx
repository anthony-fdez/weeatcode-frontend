import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";
import styles from "../followers.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { parseDate } from "../../../functions/helpers/parseDate";
import moment from "moment";
import Avatar from "react-avatar";

const MeFollowing: NextPage = () => {
  const userId = useAppSelector((state) => state.user.userId);

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    Axios.post(`${process.env.SERVER_HOST}/users/get_following`, { userId })
      .then((response) => {
        console.log(response);
        setUsers(response.data.following);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const renderUsers = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton
            style={{ marginBottom: "10px" }}
            borderRadius={13}
            count={10}
            height={120}
          />
        </>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div>
          <div className={styles.empty}>
            <img
              className={styles.image}
              src="/illustrations/tree.svg"
              alt="Empty"
            />
            <h1>So empty...</h1>
            <p>Looks like there is nobody here.</p>
          </div>
        </div>
      );
    }

    if (users) {
      return users.map((user: any, index: number) => {
        return (
          <Link
            key={index}
            passHref
            href={`/profile/${user.user.followingUserId}`}
          >
            <div className={styles.user_card_container}>
              <Avatar
                size="50px"
                round={true}
                name={user.user.followingUserName || "AA"}
              />
              <div className={styles.user_card_content}>
                <div className={styles.user_card_header}>
                  <h5>{user.user.followingUserName}</h5>
                  {user.following && <span>following</span>}
                </div>
                <p>
                  Following since: {parseDate({ date: user.user.createdAt })} -{" "}
                  {moment(user.user.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </Link>
        );
      });
    }
  };

  return (
    <main>
      <div className={styles.container}>
        <h1>Following.</h1>
        <br></br>
        {renderUsers()}
      </div>
    </main>
  );
};

export async function getStaticProps(context: NextPageContext) {
  return {
    props: {
      protected: true,
    },
  };
}

export default MeFollowing;
