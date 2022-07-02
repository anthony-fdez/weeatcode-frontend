import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../components/layouts/mainLayout/mainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { SkeletonTheme } from "react-loading-skeleton";

import { store, persistor } from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useAppSelector } from "../redux/hooks/hooks";
import { NextPage } from "next";
import AccessDenied from "../components/helperPages/accessDenied/accessDenied";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SkeletonTheme baseColor="rgb(20,20,20)" highlightColor="rgb(50,50,50)">
          <ToastContainer theme="colored" />

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
  const isLogedIn = useAppSelector((state) => state.user.isLogedIn);

  if (pageProps.protected) {
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
