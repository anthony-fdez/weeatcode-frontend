import React, { useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";
import styles from "./header.module.css";
import { BiChevronDown } from "react-icons/bi";
import { Button } from "react-bootstrap";
import Axios from "axios";

const Header = (): JSX.Element => {
  const userData = useAppSelector((state) => state.user);

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState<boolean>(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);

  const logout = () => {
    setIsLoadingLogout(true);
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
          <Button variant="danger" className={styles.logout_button}>
            Logout
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
        <h5>{userData.name}</h5>
        <BiChevronDown
          className={isMenuPopupOpen ? styles.up_arrow : styles.down_arrow}
        />
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
