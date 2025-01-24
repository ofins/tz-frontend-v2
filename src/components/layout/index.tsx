import type { PropsWithChildren } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";

interface Props {
  children?: React.ReactNode;
}

export const Layout: React.FC<PropsWithChildren> = ({ children }:Props) => {
  return (
    <div className="layout">
      <Menu />
      <div className="content">
        <Breadcrumb />
        <div>{children}</div>
      </div>
    </div>
  );
};
