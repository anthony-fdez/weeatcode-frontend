import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import styles from "./header.module.css";
import { BiChevronDown } from "react-icons/bi";
import { Button, Spinner } from "react-bootstrap";
import Axios from "axios";
import { toast } from "react-toastify";
import { setClearUserData } from "../../../redux/slices/user";
import Link from "next/link";

const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState<boolean>(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);

  const logout = () => {
    setIsLoadingLogout(true);

    const headers = {
      Authorization: userData.jwtToken || null,
    };

    let data = {
      // @ts-ignore
      HTTP_CONTENT_LANGUAGE: self.language,
    };

    Axios.post("http://localhost:3001/users/logout", data, { headers })
      .then((response) => {
        console.log(response);
        toast.success("Logged out");
      })
      .catch((e) => {
        toast.error("Could not log you out at the moment");
      })
      .finally(() => {
        setIsLoadingLogout(false);
        setIsMenuPopupOpen(false);
        dispatch(setClearUserData());
      });
  };

  const popupMenu = () => {
    return (
      <div>
        <div
          onClick={() => setIsMenuPopupOpen(false)}
          className={
            isMenuPopupOpen ? styles.popup_bg_open : styles.popup_bg_closed
          }
        ></div>
        <div
          className={isMenuPopupOpen ? styles.popup_open : styles.popup_closed}
        >
          <p>See my profile</p>
          <hr></hr>
          <Button
            onClick={logout}
            variant="danger"
            className={styles.logout_button}
          >
            {isLoadingLogout ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Logout"
            )}
          </Button>
        </div>
      </div>
    );
  };

  const logedInComponent = (): JSX.Element | null => {
    if (!userData.isLogedIn) return null;

    return (
      <div className={styles.name_container}>
        {popupMenu()}
        <div
          className={styles.name_container_name}
          onClick={() => setIsMenuPopupOpen(!isMenuPopupOpen)}
        >
          <h5>{userData.name}</h5>
          <BiChevronDown
            className={isMenuPopupOpen ? styles.up_arrow : styles.down_arrow}
          />
        </div>
      </div>
    );
  };

  const notLogedInComponent = (): JSX.Element | null => {
    if (userData.isLogedIn) return null;

    return (
      <div
        onClick={() => setIsMenuPopupOpen(!isMenuPopupOpen)}
        className={styles.name_container}
      >
        <Link href="/login" passHref>
          <Button>Login</Button>
        </Link>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <h4>Blog</h4>
        {logedInComponent()}
        {notLogedInComponent()}
      </div>
    </header>
  );
};

export default Header;
