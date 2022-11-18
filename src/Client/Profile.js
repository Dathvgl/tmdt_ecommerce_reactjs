import axios from "axios";
import React from "react";
import { Form, Image } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  AxisAlign,
  AxisSize,
  Column,
  Padding,
  Row,
} from "../Components/Layout";
import { PageIndex } from "../ComponentsJS";
import { thousandDot } from "../Function";
import { setUser } from "../React/Actions/User/Actions";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";

function ProfileClient() {
  const navigate = useNavigate();
  const { currentInfo } = useSelector((state) => state?.user);

  React.useEffect(() => {
    if (!currentInfo) navigate("/");
  }, [currentInfo, navigate]);

  return (
    <React.Fragment>
      <Profile />
      <Ordered />
    </React.Fragment>
  );
}

function Profile() {
  const node = process.env?.REACT_APP_NODE;

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state?.user);
  const { currentInfo } = useSelector((state) => state?.user, shallowEqual);

  React.useEffect(() => {
    setData(currentInfo);
  }, [currentInfo]);

  const avatar = require("../defaultAvatar.jpg");

  const inputFile = React.useRef(null);

  const defaultAvatar = {
    width: "10rem",
    height: "10rem",
    cursor: "pointer",
    objectFit: "cover",
    marginRight: "10rem",
  };

  const labelStyle = {
    width: "15rem",
  };

  const formStyle = {
    width: "20rem",
    border: "0.1rem solid black",
  };

  const radioStyle = {
    marginRight: "1rem",
  };

  const rowStyle = {
    marginBottom: "1rem",
  };

  const origin = {
    hoTen: currentInfo?.hoTen,
    hinhAnh: currentInfo?.hinhAnh,
    gioiTinh: currentInfo?.gioiTinh,
    ngaySinh: currentInfo?.ngaySinh,
    soDienThoai: currentInfo?.soDienThoai,
    diaChi: currentInfo?.diaChi,
  };

  const [data, setData] = React.useState(structuredClone(origin));
  const [image, setImage] = React.useState(
    currentInfo?.hinhAnh === "" ? avatar : currentInfo?.hinhAnh
  );

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setData((obj) => ({ ...obj, [name]: value }));
  };

  const onAltAvatar = () => {
    inputFile.current.click();
  };

  const onChangeAvatar = (e) => {
    const src = e?.target?.files[0];
    const file = URL.createObjectURL(src);
    setImage(file);
    setData((obj) => ({ ...obj, hinhAnh: src }));
  };

  const onSubmit = async () => {
    const { uid } = currentUser;
    const { id } = currentInfo;

    const alt = new FormData();

    Object.keys(origin)?.forEach((item) => {
      if (origin[item] === data[item]) return;
      alt.append([item], data[item]);
    });

    await axios
      .put(`${node}/user/${uid}/${id}`, alt, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_) => {
        dispatch(setUser(currentUser));
        toast("Đã lưu thay đổi");
      });
  };

  return (
    <React.Fragment>
      <Padding all={2}>
        <h4>Thông tin tài khoản</h4>
        <div style={{ borderRadius: "1rem", backgroundColor: "white" }}>
          <Padding all={2}>
            <Row style={rowStyle}>
              <Image
                src={image}
                style={defaultAvatar}
                roundedCircle
                onClick={onAltAvatar}
              />
              <input
                type="file"
                ref={inputFile}
                onChange={onChangeAvatar}
                style={{ display: "none" }}
              />
              <Column mainAxisAlign={AxisAlign.start}>
                <Row style={rowStyle} mainAxisSize={AxisSize.min}>
                  <div style={labelStyle}>Họ & tên</div>
                  <Form.Control
                    name="hoTen"
                    style={formStyle}
                    value={data.hoTen}
                    onChange={onChangeInput}
                    autoComplete="off"
                  />
                </Row>
                <Row style={rowStyle} mainAxisSize={AxisSize.min}>
                  <div style={labelStyle}>Ngày sinh</div>
                  <Form.Control
                    name="ngaySinh"
                    type="date"
                    style={formStyle}
                    value={data.ngaySinh}
                    onChange={onChangeInput}
                    autoComplete="off"
                  />
                </Row>
                <Row style={rowStyle} mainAxisSize={AxisSize.min}>
                  <div style={labelStyle}>Giới tính</div>
                  <Form.Check
                    style={radioStyle}
                    name="gioiTinh"
                    label="Nam"
                    type="radio"
                    value="Nam"
                    onChange={onChangeInput}
                  />
                  <Form.Check
                    name="gioiTinh"
                    label="Nữ"
                    type="radio"
                    value="Nữ"
                    onChange={onChangeInput}
                  />
                </Row>
                <Row mainAxisSize={AxisSize.min}>
                  <div style={labelStyle}>Số điện thoại</div>
                  <Form.Control
                    name="soDienThoai"
                    style={formStyle}
                    value={data.soDienThoai}
                    onChange={onChangeInput}
                    autoComplete="off"
                  />
                </Row>
              </Column>
            </Row>
            <Row style={rowStyle} mainAxisSize={AxisSize.min}>
              <div style={{ ...labelStyle, ...{ paddingLeft: "3.5rem" } }}>
                Địa chỉ
              </div>
              <Form.Control
                name="diaChi"
                style={{ width: "40rem", border: "0.1rem solid black" }}
                value={data.diaChi}
                onChange={onChangeInput}
                autoComplete="off"
              />
            </Row>
            <Row mainAxisAlign={AxisAlign.end}>
              <Button type="primary" onClick={onSubmit}>
                Lưu thay đổi
              </Button>
            </Row>
            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </Padding>
        </div>
      </Padding>
    </React.Fragment>
  );
}

function Ordered() {
  const node = process.env?.REACT_APP_NODE;

  const navigate = useNavigate();
  const { currentInfo } = useSelector((state) => state?.user);

  const itemPage = 5;
  const [ordered, setOrdered] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [indexed, setIndexed] = React.useState(0);

  React.useEffect(() => {
    async function getOrders() {
      if (!currentInfo) return;

      const { id } = currentInfo;

      const res = await axios.get(`${node}/payment/${id}`);
      const { data } = res;

      if (!data) return;

      const { chiTiet } = data;
      if (Object.keys(chiTiet).length === 0) return;

      const array = Object.keys(chiTiet)
        .map((item) => ({ ...chiTiet[item], id: item }))
        .reverse();

      setOrdered(array);

      const n = array?.length;
      setIndexed(n);
      setList(structuredClone(array)?.slice(0, n > itemPage ? itemPage : n));
    }

    getOrders();
  }, [currentInfo, node]);

  const altPage = React.useCallback(
    (x, y) => {
      setList(ordered?.slice(x, y));
    },
    [ordered]
  );

  const linkItemStyle = {
    cursor: "pointer",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const onClickedLink = (id) => navigate(`/SanPham/ChiTiet/${id}`);

  return (
    <React.Fragment>
      <Padding all={2}>
        <h4>Đơn hàng của tôi</h4>
        <div style={{ borderRadius: "1rem", backgroundColor: "white" }}>
          <Padding all={2}>
            {ordered.length === 0 ? (
              <React.Fragment>
                <div>Bạn chưa từng đặt hàng lần nào</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {list?.map((obj, index) => (
                  <React.Fragment key={index}>
                    <Row mainAxisAlign={AxisAlign.spaceBetween}>
                      <h4>Tình trạng: {obj?.tinhTrang}</h4>
                      <Row mainAxisSize={AxisSize.min}>
                        <div style={{ marginRight: "2rem" }}>
                          Ngày đặt: {obj?.ngayDatHang}
                        </div>
                        <div>Ngày giao: {obj?.ngayGiaoHang}</div>
                      </Row>
                    </Row>
                    {Object.keys(obj?.sanPham)?.map((key, count) => {
                      const item = obj?.sanPham[key];
                      return (
                        <React.Fragment key={count}>
                          <Padding all={1}>
                            <Row mainAxisAlign={AxisAlign.spaceBetween}>
                              <Row mainAxisAlign={AxisAlign.start}>
                                <div
                                  style={{ display: "flex" }}
                                  onClick={() => onClickedLink(item?.id)}
                                >
                                  <Image
                                    style={{
                                      cursor: "pointer",
                                      width: "5rem",
                                      marginRight: "1rem",
                                    }}
                                    src={item?.hinhAnh}
                                  />
                                  <div style={{ width: "30rem" }}>
                                    <b style={linkItemStyle}>{item?.ten}</b>
                                  </div>
                                </div>
                                <div style={{ marginRight: "10rem" }}>
                                  Số lượng: {item?.soLuong}
                                </div>
                                {item?.giamGia === 0 ? (
                                  <React.Fragment>
                                    <div>
                                      Giá gốc: {thousandDot(item?.giaGoc)}
                                      <u>đ</u>
                                    </div>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment>
                                    <del>
                                      Giá gốc: {thousandDot(item?.giaGoc)}
                                      <u>đ</u>
                                    </del>
                                    <div>
                                      Giá gốc:{" "}
                                      {thousandDot(
                                        item?.giaGoc -
                                          item?.giaGoc * item?.giamGia
                                      )}
                                      <u>đ</u>
                                    </div>
                                  </React.Fragment>
                                )}
                              </Row>
                              <div>
                                {thousandDot(item?.giaTong)}
                                <u>đ</u>
                              </div>
                            </Row>
                          </Padding>
                        </React.Fragment>
                      );
                    })}
                    <h5 style={{ textAlign: "right" }}>
                      Tổng tiền:{" "}
                      <span style={{ color: "red" }}>
                        {thousandDot(obj?.thanhTien)}
                        <u>đ</u>
                      </span>
                    </h5>
                    <hr />
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
            <Row mainAxisAlign={AxisAlign.spaceBetween}>
              <b>Hiển thị {itemPage} đơn hàng</b>
              <PageIndex
                length={indexed}
                limited={itemPage}
                callback={altPage}
              />
            </Row>
          </Padding>
        </div>
      </Padding>
    </React.Fragment>
  );
}

export default ProfileClient;
