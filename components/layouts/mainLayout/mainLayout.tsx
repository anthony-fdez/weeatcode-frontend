import React from "react";

// conponents
import Header from "../../shared/header/header";
import Footer from "../../shared/footer/footer";

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props): JSX.Element => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
