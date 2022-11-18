import { Button, Dropdown, Input } from "antd";
import React from "react";
import { Image } from "react-bootstrap";
import { BsFacebook, BsTwitter, BsYoutube } from "react-icons/bs";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AxisAlign,
  AxisSize,
  Column,
  Padding,
  Row,
  SideBarHorizontal,
  SizedBox,
} from "../Components/Layout";
import { Center } from "../Components/Widget";
import { signoutInitiate } from "../React/Actions/User/Actions";
import "bootstrap/dist/css/bootstrap.min.css";

function HeaderClient() {
  const navigate = useNavigate();
  const { currentInfo } = useSelector((state) => state?.user);
  const { products } = useSelector(
    (state) => state.fireBase?.extensions?.realTime
  );

  const baseSlice = 5;

  const [input, setInput] = React.useState("");
  const [search, setSearch] = React.useState([]);

  const logo = require("../logo.png");

  const defaultLogo = {
    height: "2rem",
    cursor: "pointer",
  };

  const boxStyle = {
    zIndex: "1",
    width: "100%",
    color: "black",
    position: "absolute",
    border: "1px black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  const itemStyle = {
    overflow: "hidden",
    wordBreak: "break-all",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const onChangeInput = (e) => {
    if (!products) return;

    const { value } = e.target;
    setInput(value);

    if (!value.replace(/\s/g, "").length || value === "") {
      setSearch([]);
      return;
    }

    const str = value?.split(" ");

    const array = products
      ?.map(({ id, coBan }) => ({ id, coBan }))
      ?.map(({ id, coBan }) => ({
        id: id,
        ten: coBan?.ten,
        hinhAnh: coBan?.hinhAnh[0],
      }));

    const filter = array?.filter(({ ten }) => {
      const name = ten.toLowerCase();
      return str?.some((char) => name?.includes(char.toLowerCase()));
    });

    const n = filter?.length;

    setSearch(filter?.slice(0, n < baseSlice ? n : baseSlice));
  };

  const onClickedNavigate = (url) => {
    navigate(url);
    setInput("");
    setSearch([]);
  };

  const listStyle = { fontSize: "1rem", height: "2.25rem" };

  const onClickList = (url) => navigate(url);

  return (
    <React.Fragment>
      <SideBarHorizontal>
        <Padding horizontal="5%" vertical={2}>
          <Row
            mainAxisAlign={AxisAlign.spaceBetween}
            crossAxisAlign={AxisAlign.center}
          >
            <Image
              src={logo}
              style={defaultLogo}
              onClick={() => onClickedNavigate("/")}
            />
            <Row>
              <div style={{ width: "30%", position: "relative" }}>
                <Input
                  style={{ fontSize: "1rem" }}
                  value={input}
                  placeholder="Search"
                  onChange={onChangeInput}
                />
                {search?.length !== 0 && (
                  <React.Fragment>
                    <div style={boxStyle}>
                      <Padding all={1}>
                        <div>
                          <b>Hiển thị {baseSlice} kết quả</b>
                        </div>
                        {search?.map((item, index, { length }) => (
                          <React.Fragment key={index}>
                            <Row
                              style={{ cursor: "pointer" }}
                              mainAxisAlign={AxisAlign.start}
                              onClick={() =>
                                onClickedNavigate(
                                  `/SanPham/ChiTiet/${item?.id}`
                                )
                              }
                            >
                              <Image
                                style={{
                                  width: "5rem",
                                  marginRight: "1rem",
                                }}
                                src={item?.hinhAnh}
                              />
                              <div style={itemStyle}>{item?.ten}</div>
                            </Row>
                            {index !== length - 1 && <hr />}
                          </React.Fragment>
                        ))}
                      </Padding>
                    </div>
                  </React.Fragment>
                )}
              </div>
              <Button
                style={listStyle}
                type="primary"
                onClick={() => onClickList("SanPham/Danhsach")}
              >
                Laptops
              </Button>
              {currentInfo && currentInfo?.vaiTro !== "client" && (
                <React.Fragment>
                  <Button
                    style={listStyle}
                    onClick={() => onClickList("Admin/Dashboard")}
                  >
                    Admin
                  </Button>
                </React.Fragment>
              )}
            </Row>
            <HeaderClientUser />
          </Row>
        </Padding>
      </SideBarHorizontal>
    </React.Fragment>
  );
}

function HeaderClientUser() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.user);
  const { currentInfo } = useSelector((state) => state?.user);

  const avatar = require("../defaultAvatar.jpg");

  const defaultAvatar = {
    width: "3rem",
    height: "3rem",
    cursor: "pointer",
    objectFit: "cover",
  };

  const defaultIcon = {
    width: "3rem",
    height: "3rem",
    border: "0.2rem white solid",
    borderRadius: "50rem",
    backgroundColor: "transparent",
  };

  const handleAuth = () => dispatch(signoutInitiate());

  const linkStyle = {
    fontSize: "1rem",
    textDecoration: "none",
  };

  const items = !currentUser
    ? [
        {
          key: 1,
          label: (
            <React.Fragment>
              <Link style={linkStyle} to="Login/SignUp">
                Đăng ký
              </Link>
            </React.Fragment>
          ),
        },
        {
          key: 2,
          label: (
            <React.Fragment>
              <Link style={linkStyle} to="Login/SignIn">
                Đăng nhập
              </Link>
            </React.Fragment>
          ),
        },
      ]
    : [
        {
          key: 1,
          label: (
            <React.Fragment>
              <Link style={linkStyle} to="UserProfile">
                Thông tin cá nhân
              </Link>
            </React.Fragment>
          ),
        },
        {
          key: 2,
          label: (
            <React.Fragment>
              <Link style={linkStyle} to="/" onClick={handleAuth}>
                Đăng xuất
              </Link>
            </React.Fragment>
          ),
        },
      ];

  return (
    <React.Fragment>
      <Row mainAxisSize={AxisSize.min}>
        <Link style={defaultIcon} to={"GioHang"}>
          <Center>
            <FaShoppingCart size="1.5rem" color="white" />
          </Center>
        </Link>
        <SizedBox width="0.5rem" />
        {!currentUser ? (
          <React.Fragment>
            <Dropdown
              menu={{ items, style: { width: "12rem" } }}
              placement="bottomRight"
            >
              <div style={defaultIcon}>
                <Center>
                  <FaUser size="1.5rem" color="white" />
                </Center>
              </div>
            </Dropdown>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Dropdown menu={{ items }} placement="bottomRight">
              <Image
                src={
                  currentInfo?.hinhAnh === "" ? avatar : currentInfo?.hinhAnh
                }
                style={defaultAvatar}
                roundedCircle
              />
            </Dropdown>
          </React.Fragment>
        )}
      </Row>
    </React.Fragment>
  );
}

function FooterClient() {
  const itemStyle = {
    backgroundColor: "white",
  };

  const footerStyle = {
    color: "white",
    textAlign: "center",
    backgroundColor: "black",
  };

  const textStyle = {
    width: "30rem",
    padding: "1rem 0",
    textAlign: "justify",
    textAlignLast: "justify",
  };

  const iconSize = "2rem";

  const iconStyle = {
    cursor: "pointer",
  };

  const spaceStyle = {
    marginRight: "1rem",
  };

  const onClickedIcon = (url) => (window.location.href = url);

  return (
    <React.Fragment>
      <div style={itemStyle}>
        <Padding vertical={2}>
          <Column>
            <h3 style={{ margin: "0" }}>Sofarsoguk</h3>
            <div style={textStyle}>
              Sofarsoguk là trang web thương mại về laptop. Tại đây có trưng bày
              đa dạng laptop để khách hàng lựa chọn thoải mái
            </div>
            <Row mainAxisSize={AxisSize.min}>
              <BsFacebook
                onClick={() => onClickedIcon("https://www.facebook.com/")}
                size={iconSize}
                style={{ ...iconStyle, ...spaceStyle }}
              />
              <BsTwitter
                onClick={() => onClickedIcon("https://twitter.com/")}
                size={iconSize}
                style={{ ...iconStyle, ...spaceStyle }}
              />
              <BsYoutube
                onClick={() => onClickedIcon("https://www.youtube.com/")}
                size={iconSize}
                style={{ ...iconStyle }}
              />
            </Row>
          </Column>
        </Padding>
      </div>
      <footer style={footerStyle}>
        <Padding vertical={2}>
          <div>
            Design By <u>fsfssfssfsfsfs</u>
          </div>
        </Padding>
      </footer>
    </React.Fragment>
  );
}

function ContentClient() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}

function HomeClient() {
  return (
    <React.Fragment>
      <HeaderClient />
      <ContentClient />
      <FooterClient />
    </React.Fragment>
  );
}

export default HomeClient;
