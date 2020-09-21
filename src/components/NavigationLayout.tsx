import React, { useState, FunctionComponent } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBMask,
  MDBView,
} from "mdbreact";

type NavigationLayoutProps = {
  children: any;
};

const NavigationLayout: FunctionComponent<NavigationLayoutProps> = ({
  children,
}) => {
  const [collapse, setCollapse] = useState<boolean>(false);

  const handleClick = (event: any) => {
    setCollapse(!collapse);
  };

  return (
    <>
      <header>
        <MDBNavbar
          className="text-monospace"
          style={{ backgroundColor: "black" }}
          dark
          expand="md"
        >
          <MDBContainer>
            <MDBNavbarBrand href="/">
              <strong>Navbar</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={handleClick} />
            <MDBCollapse isOpen={collapse} navbar>
              <MDBNavbarNav left>
                <MDBNavItem active>
                  <MDBNavLink to="/">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink to="/basic">Basic</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink to="/pie">Pie</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </header>
      <MDBContainer style={{ height: "100%", width: "100%" }}>
        {children}
      </MDBContainer>
    </>
  );
};

export default NavigationLayout;
