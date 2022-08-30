/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import styles from "./header.module.css";
import { BiChevronDown } from "react-icons/bi";
import { Button, Spinner } from "react-bootstrap";
import Axios from "axios";
import { toast } from "react-toastify";
import { setClearUserData } from "../../../redux/slices/user";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/router";

const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const router = useRouter();

  const { query } = router.query;

  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState<boolean>(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!query) return;

    // @ts-ignore
    setSearchText(query);
  }, [query]);

  const logout = () => {
    setIsLoadingLogout(true);

    const headers = {
      Authorization: userData.jwtToken || "",
    };

    let data = {
      // @ts-ignore
      HTTP_CONTENT_LANGUAGE: self.language,
    };

    Axios.post(`${process.env.SERVER_HOST}/users/logout`, data, { headers })
      .then((response) => {
        setTimeout(() => {
          toast.success("Logged out");
          dispatch(setClearUserData());
        }, 500);
        setIsMenuPopupOpen(false);
        setIsLoadingLogout(false);
      })
      .catch((e) => {
        toast.error("Could not log you out at the moment");
        setIsMenuPopupOpen(false);
        setIsLoadingLogout(false);
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
          <ul className={styles.popup_menu_items}>
            <Link passHref href="/me">
              <li
                className={styles.popup_menu_item}
                onClick={() => setIsMenuPopupOpen(false)}
              >
                Profile
              </li>
            </Link>
            <Link passHref href="/post/createPost">
              <li
                className={styles.popup_menu_item}
                onClick={() => setIsMenuPopupOpen(false)}
              >
                New Post
              </li>
            </Link>
          </ul>

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

  const loggedInComponent = (): JSX.Element | null => {
    if (!userData.isLoggedIn) return null;

    return (
      <div className={styles.name_container}>
        {popupMenu()}
        <div
          className={styles.name_container_name}
          onClick={() => setIsMenuPopupOpen(!isMenuPopupOpen)}
        >
          <h5>{userData.name}</h5>
          <GiHamburgerMenu className={styles.burger_button} />
          <BiChevronDown
            className={isMenuPopupOpen ? styles.up_arrow : styles.down_arrow}
          />
        </div>
      </div>
    );
  };

  const notLoggedInComponent = (): JSX.Element | null => {
    if (userData.isLoggedIn) return null;

    return (
      <div className={styles.name_container}>
        <Link href="/login" passHref>
          <Button>Login</Button>
        </Link>
      </div>
    );
  };

  const searchBar = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();

          router.push(`/search?query=${searchText}`);
        }}
        className={styles.search_bar_container}
      >
        <input
          placeholder="Search posts"
          type="text"
          className={styles.search_bar}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className={styles.search_submit_button} type="submit">
          <AiOutlineSearch />
        </button>
      </form>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <div className={styles.header_left_container}>
          <Link passHref href={"/"}>
            <img
              alt="We eat code logo"
              className={styles.logo}
              src="/images/logo.png"
            />
          </Link>
          {searchBar()}
        </div>

        {loggedInComponent()}
        {notLoggedInComponent()}
      </div>
    </header>
  );
};

export default Header;
