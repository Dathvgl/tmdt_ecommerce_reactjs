import React from "react";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AxisAlign, Padding, Row } from "../Components/Layout";
import { thousandDot } from "../Function";

function DetailOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { currentInfo } = useSelector((state) => state?.user);

  React.useEffect(() => {
    if (!currentInfo) navigate("/");
  }, [currentInfo, navigate]);

  const split = state?.ngayDatHang?.split(":");
  const splitTime = split[1]?.split("-");

  const dateOrder = new Date(`${split[0]}:${splitTime[0]}:${splitTime[1]}`);

  const dateTranfer = new Date(state?.ngayGiaoHang);

  const whiteStyle = { borderRadius: "1rem", backgroundColor: "white" };

  const linkItemStyle = {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const onClickedLink = (id) => navigate(`/SanPham/ChiTiet/${id}`);

  return (
    <React.Fragment>
      {currentInfo && (
        <React.Fragment>
          <Padding all={2}>
            <h4>Thông tin đơn hàng</h4>
            <div style={whiteStyle}>
              <Padding all={1}>
                <Row mainAxisAlign={AxisAlign.spaceAround}>
                  <div>
                    <h5>Mã đơn hàng</h5>
                    <div>{state?.gioHangId}</div>
                  </div>
                  <div>
                    <h5>Tình trạng</h5>
                    <div>{state?.tinhTrang}</div>
                  </div>
                  <div>
                    <h5>Ngày đặt hàng</h5>
                    <div>{dateOrder.toLocaleString()}</div>
                  </div>
                  <div>
                    <h5>Ngày giao hàng</h5>
                    <div>{dateTranfer.toLocaleString()}</div>
                  </div>
                </Row>
                <hr />
                <Row mainAxisAlign={AxisAlign.spaceAround}>
                  <div>
                    <h5>Họ tên</h5>
                    <div>{state?.hoTen}</div>
                  </div>
                  <div>
                    <h5>Địa chỉ</h5>
                    <div>{state?.diaChi}</div>
                  </div>
                </Row>
              </Padding>
            </div>
          </Padding>
          <Padding all={2}>
            <h4>Các sản phẩm</h4>
            <div style={whiteStyle}>
              <Padding all={1}>
                {Object.keys(state?.sanPham).map((key) => {
                  const item = state?.sanPham[key];
                  return (
                    <React.Fragment key={key}>
                      <Padding all={1}>
                        <Row
                          style={{ cursor: "pointer" }}
                          mainAxisAlign={AxisAlign.spaceBetween}
                          onClick={() => onClickedLink(item?.id)}
                        >
                          <Row mainAxisAlign={AxisAlign.start}>
                            <div style={{ display: "flex" }}>
                              <Image
                                style={{
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
                                    item?.giaGoc - item?.giaGoc * item?.giamGia
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
                      <hr />
                    </React.Fragment>
                  );
                })}
                <h5 style={{ textAlign: "right" }}>
                  Tổng tiền:{" "}
                  <span style={{ color: "red" }}>
                    {thousandDot(state?.thanhTien)}
                    <u>đ</u>
                  </span>
                </h5>
              </Padding>
            </div>
          </Padding>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default DetailOrder;
