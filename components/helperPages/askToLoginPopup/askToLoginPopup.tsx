import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { setAskToLoginPopup } from "../../../redux/slices/askToLoginPopup";
import styles from "./askToLoginPopup.module.css";

const AskToLoginPopup = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.askToLoginPopup.isOpen);

  return (
    <div>
      <div
        onClick={() => dispatch(setAskToLoginPopup(false))}
        className={isOpen ? styles.open_bg : styles.closed_bg}
      ></div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            className={styles.menu}
          >
            <div>
              <h3>Hold up!</h3>
            </div>
            <hr></hr>
            <p>
              You are not logged in, please log in if you would like to
              expirience the full website. Interact with posts, comment and
              write your own blog posts!
            </p>
            <br></br>
            <Link href="/signup" passHref>
              <Button
                onClick={() => dispatch(setAskToLoginPopup(false))}
                className={styles.button}
              >
                Create new Account
              </Button>
            </Link>
            <p style={{ textAlign: "center" }}>or</p>
            <Link href="/login" passHref>
              <Button
                onClick={() => dispatch(setAskToLoginPopup(false))}
                className={styles.button}
              >
                Login
              </Button>
            </Link>
            <hr></hr>

            <p
              onClick={() => dispatch(setAskToLoginPopup(false))}
              className={styles.go_back_link}
            >
              Go back
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskToLoginPopup;
