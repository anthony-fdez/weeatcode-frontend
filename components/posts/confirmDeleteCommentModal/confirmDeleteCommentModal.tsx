import Axios from "axios";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../redux/hooks/hooks";
import styles from "./confirmDeleteCommentModal.module.css";

interface Props {
  isOpen: boolean;
  commentId: number;
  handleClose: () => void;
  getNewComments: Function;
}

const ConfirmDeleteCommentModal = ({
  isOpen,
  commentId,
  handleClose,
  getNewComments,
}: Props): JSX.Element | null => {
  const token = useAppSelector((state) => state.user.jwtToken);
  const [loadingDeletingComment, setLoadingDeletingComment] = useState(false);

  const deletePost = () => {
    setLoadingDeletingComment(true);

    Axios.post(
      `${process.env.SERVER_HOST}/posts/comment/delete`,
      {
        commentId: commentId,
      },
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
      .then((response) => {
        toast.success("Comment deleted.");
        getNewComments();
      })
      .catch((e) => {
        toast.error("Could not delete comment.");
      })
      .finally(() => {
        handleClose();
        setLoadingDeletingComment(false);
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
          <h3>Delete Comment</h3>
        </div>
        <hr></hr>
        <div className={styles.body}>
          <p>
            Are you sure you want to delete this comment? You will not be able
            to recover it once its deleted
          </p>
        </div>
        <br></br>
        <div className={styles.footer}>
          <Button onClick={() => handleClose()}>Close</Button>
          <Button variant="danger" onClick={() => deletePost()}>
            {loadingDeletingComment ? (
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

export default ConfirmDeleteCommentModal;
