import React, { useState } from "react";
import styles from "./confirmDeletePostModal.module.css";
import Axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../redux/hooks/hooks";

interface Props {
  isOpen: boolean;
  postId: number;
  handleClose: () => void;
}

const ConfirmDeletePostModal = ({
  isOpen,
  postId,
  handleClose,
}: Props): JSX.Element | null => {
  const token = useAppSelector((state) => state.user.jwtToken);
  const [loadingDeletingPost, setLoadingDeletingPost] = useState(false);

  const deletePost = () => {
    setLoadingDeletingPost(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/delete`,
      { postId },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        console.log(response);
        toast.success("Post deleted.");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Could not delete post.");
      })
      .finally(() => {
        setLoadingDeletingPost(false);
        handleClose();
      });
  };

  return (
    <>
      <div
        onClick={() => handleClose()}
        className={isOpen ? styles.open_bg : styles.closed_bg}
      ></div>
      <div className={isOpen ? styles.open : styles.closed}>
        <div className={styles.header}>
          <h3>Delete Post</h3>
        </div>
        <hr></hr>
        <div className={styles.body}>
          <p>
            Are you sure you want to delete this post? You will not be able to
            recover it once its deleted
          </p>
        </div>
        <br></br>
        <div className={styles.footer}>
          <Button onClick={() => handleClose()}>Close</Button>
          <Button variant="danger" onClick={() => deletePost()}>
            {loadingDeletingPost ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete it"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDeletePostModal;
