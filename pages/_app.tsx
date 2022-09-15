import type { AppProps } from "next/app";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../components/layouts/mainLayout/mainLayout";
import "../styles/custom.scss";
import "../styles/globals.css";
import "../styles/editor.scss";
import "highlight.js/styles/default.css";

import NextNProgress from "nextjs-progressbar";
import { SkeletonTheme } from "react-loading-skeleton";

import Axios from "axios";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AccessDenied from "../components/helperPages/accessDenied/accessDenied";
import AskToLoginPopup from "../components/helperPages/askToLoginPopup/askToLoginPopup";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { setClearUserData } from "../redux/slices/user";
import { persistor, store } from "../redux/store";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
                `}
      </Script>

      <PersistGate loading={null} persistor={persistor}>
        <NextNProgress color="#FF0038" />
        <SkeletonTheme baseColor="rgb(20,20,20)" highlightColor="rgb(50,50,50)">
          <ToastContainer theme="colored" />
          <AskToLoginPopup />
          <Auth pageProps={pageProps}>
            <MainLayout>
              <DefaultSeo title={"WeEatCode"} />
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
    Axios.post(
      `${process.env.SERVER_HOST}/users/test-auth`,
      {},
      {
        headers: {
          Authorization: token || "",
        },
      }
    )
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
