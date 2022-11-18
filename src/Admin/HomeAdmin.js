import { Button, Menu } from "antd";
import React from "react";
import { Image } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AxisAlign,
  Column,
  Padding,
  Row,
  SideBarHorizontal,
  SideBarVertical,
  SizedBox,
} from "../Components/Layout";

// https://dashtar-admin.vercel.app/dashboard

function HomeAdmin() {
  return (
    <React.Fragment>
      <MenuAdmin></MenuAdmin>
      <ContentAdmin></ContentAdmin>
    </React.Fragment>
  );
}

function MenuAdmin() {
  const navigate = useNavigate();

  const listStyle = { fontSize: "1rem", width: "100%", height: "3rem" };

  const onClickList = (url) => navigate(url);

  const items = [
    { key: 1, label: "Thông tin" },
    { key: 2, label: "Danh mục" },
    { key: 3, label: "Sản phẩm" },
    { key: 4, label: "Người dùng" },
    { key: 5, label: "Đơn hàng" },
  ];

  const onSelectMenu = (all) => {
    const { key } = all;
    const array = ["Dashboard", "Category", "Product", "User", "Payment"];
    navigate(array[key - 1]);
  };

  return (
    <React.Fragment>
      <SideBarVertical backgroundColor="#001529">
        <Padding vertical={1.5}>
          <Column crossAxisAlign={AxisAlign.spaceBetween}>
            <Column
              mainAxisAlign={AxisAlign.start}
              crossAxisAlign={AxisAlign.start}
            >
              <Row>
                <FaHome size={30} />
                <SizedBox width="4%" />
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  Admin
                </div>
              </Row>
              <SizedBox height={1.5} />
              <Menu
                style={{ width: "100%", fontSize: "1rem" }}
                defaultSelectedKeys={["1"]}
                theme="dark"
                items={items}
                onSelect={onSelectMenu}
              />
            </Column>
            <Padding horizontal="10%">
              <Button
                style={listStyle}
                type="primary"
                danger
                onClick={() => onClickList("/")}
              >
                Trang chủ
              </Button>
            </Padding>
          </Column>
        </Padding>
      </SideBarVertical>
    </React.Fragment>
  );
}

function ContentAdmin() {
  return (
    <React.Fragment>
      <Padding
        style={{
          height: "100vh",
          display: "flex",
          flexFlow: "column",
        }}
        left="20%"
      >
        <HeaderAdmin />
        <BodyAdmin />
      </Padding>
    </React.Fragment>
  );
}

function HeaderAdmin() {
  const { currentInfo } = useSelector((state) => state?.user);

  const avatar = require("../defaultAvatar.jpg");

  const defaultAvatar = {
    width: "3rem",
    height: "3rem",
    objectFit: "cover",
  };

  return (
    <React.Fragment>
      <SideBarHorizontal style={{ flex: "0 1 auto" }}>
        <Padding horizontal="5%" vertical={2}>
          <Row mainAxisAlign={AxisAlign.end} crossAxisAlign={AxisAlign.center}>
            <div>
              <Image
                src={
                  currentInfo?.hinhAnh === "" ? avatar : currentInfo?.hinhAnh
                }
                style={defaultAvatar}
                roundedCircle
              />
            </div>
          </Row>
        </Padding>
      </SideBarHorizontal>
    </React.Fragment>
  );
}

function BodyAdmin() {
  return (
    <React.Fragment>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        <Padding all="2rem">
          <Outlet />
          <SizedBox width="100%" height="2rem" />
        </Padding>
      </Scrollbars>
    </React.Fragment>
  );
}

export default HomeAdmin;
