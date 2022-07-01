import "../styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../components/layouts/mainLayout/mainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { SkeletonTheme } from "react-loading-skeleton";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SkeletonTheme baseColor="rgb(20,20,20)" highlightColor="rgb(50,50,50)">
      <MainLayout>
        <ToastContainer theme="dark" />
        <Component {...pageProps} />
      </MainLayout>
    </SkeletonTheme>
  );
}

export default MyApp;
