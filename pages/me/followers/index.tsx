import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";
import styles from "../followers.module.css";
import Axios from "axios";
import Skeleton from "react-loading-skeleton";
import UserCard from "../../../components/userCard/userCard";
import Link from "next/link";
import { parseDate } from "../../../functions/helpers/parseDate";
import moment from "moment";
import Avatar from "react-avatar";

const MeFollowers: NextPage = () => {
  const userId = useAppSelector((state) => state.user.userId);

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    Axios.post(`${process.env.SERVER_HOST}/users/get_followers`, { userId })
      .then((response) => {
        console.log(response);
        setUsers(response.data.followers);
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

    if (users) {
      return users.map((user: any, index: number) => {
        return (
          <Link key={index} passHref href={`/profile/${user.user.userId}`}>
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
                  Member since: {parseDate({ date: user.user.createdAt })} -{" "}
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
        <h1>Followers</h1>
        <br></br>
        {renderUsers()}
      </div>
    </main>
  );
};

export default MeFollowers;
