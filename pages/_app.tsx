import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../components/layouts/mainLayout/mainLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { SkeletonTheme } from "react-loading-skeleton";
import NextNProgress from "nextjs-progressbar";

import { store, persistor } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { NextPage } from "next";
import AccessDenied from "../components/helperPages/accessDenied/accessDenied";
import AskToLoginPopup from "../components/helperPages/askToLoginPopup/askToLoginPopup";
import { useEffect } from "react";
import Axios from "axios";
import {
  setClearUserData,
  setisLoggedIn,
  setToken,
  setUserId,
  setUserName,
} from "../redux/slices/user";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextNProgress color="#FF4500" />
        <SkeletonTheme baseColor="rgb(20,20,20)" highlightColor="rgb(50,50,50)">
          <ToastContainer theme="colored" />
          <AskToLoginPopup />
          <Auth pageProps={pageProps}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </Auth>
        </SkeletonTheme>
      </PersistGate>
    </Provider>
  );
}

interface AuthProps {
  children: JSX.Element;
  pageProps: any;
}

const Auth = ({ children, pageProps }: AuthProps) => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const token = useAppSelector((state) => state.user.jwtToken);

  useEffect(() => {
    Axios.post(`${process.env.SERVER_HOST}/users/test-auth`, {
      headers: {
        Authorization: token,
      },
    })
      .then(() => {
        // all good
      })
      .catch(() => {
        if (isLoggedIn) {
          dispatch(setClearUserData());
          toast.info("You have been logged out. Please log in again.");
        }
      });
  }, []);

  if (!isLoggedIn && pageProps.protected) {
    return (
      <MainLayout>
        <AccessDenied />
      </MainLayout>
    );
  }

  return children;
};

// Pute the code below at the end of any page that needs to be protected

// export async function getStaticProps(context: NextPageContext) {
//   return {
//     props: {
//       protected: true,
//     },
//   };
// }

export default MyApp;
