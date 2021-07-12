import React from "react";
import Link from "next/link";
import { Screens } from "../navigation/routerUtils";

const signedOutLinks = [
  { label: "Sign in", href: Screens.SIGNIN },
  { label: "Sign up", href: Screens.SIGNUP },
];

const signedInLinks = [{ label: "Sign out", href: Screens.SIGNOUT }];

const renderLink = ({ label, href }) => (
  <NavLink label={label} href={href} key={href} />
);

const Links = ({ currentUser }) => {
  if (currentUser) {
    return signedInLinks.map(renderLink);
  }
  return signedOutLinks.map(renderLink);
};

const NavLink = React.memo(({ label, href }) => {
  return (
    <li className="nav-item">
      <Link href={href}>
        <a className="nav-link">{label}</a>
      </Link>
    </li>
  );
});

const Header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href={Screens.ROOT}>
        <a className="px-5 navbar-brand">Ticketing</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          <Links currentUser={currentUser} />
        </ul>
      </div>
    </nav>
  );
};

export default Header;
