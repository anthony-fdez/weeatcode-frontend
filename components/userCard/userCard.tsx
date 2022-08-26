import moment from "moment";
import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import { parseDate } from "../../functions/helpers/parseDate";
import styles from "./userCard.module.css";

const UserCard = ({ user }: { user: any }) => {
  console.log(user);
  return (
    <Link passHref href={`/profile/${user.user.id}`}>
      <div className={styles.user_card_container}>
        <Avatar size="50px" round={true} name={user.user.name || "AA"} />
        <div className={styles.user_card_content}>
          <div className={styles.user_card_header}>
            <h5>{user.user.name}</h5>
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
};

export default UserCard;
