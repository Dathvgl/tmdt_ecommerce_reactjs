import React from "react";
import { Carousel } from "react-responsive-carousel";
import { AxisAlign, Padding, Row } from "../Components/Layout";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thousandDot } from "../Function";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function DashboardClient() {
  const css = `
    .control-arrow {
      width: 5rem;
    }
    .carousel-root,
    .carousel-slider,
    .carousel-slider,
    .slider-wrapper,
    ul.slider {
      height: 100%;
    }
  `;

  const carouselImageStyle = {
    width: "fit-content",
    height: "100%",
    objectFit: "cover",
  };

  const carouselImage = {
    image1:
      "https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/tin-tuc/145253/Originals/NF_1200x628.jpg",
    image2:
      "https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/tin-tuc/143035/Originals/NF_1200x628_1644214085.png",
    image3:
      "https://fptshop.com.vn/uploads/originals/2021/5/24/637574684469967511_nf_1200x628.png",
  };

  const itemStyle = {
    width: "100%",
    height: "30rem",
    backgroundColor: "white",
  };

  return (
    <React.Fragment>
      <div style={itemStyle}>
        <Padding all={3}>
          <Carousel showThumbs={false} emulateTouch infiniteLoop autoPlay>
            <Image style={carouselImageStyle} src={carouselImage.image1} />
            <Image style={carouselImageStyle} src={carouselImage.image2} />
            <Image style={carouselImageStyle} src={carouselImage.image3} />
          </Carousel>
          <style>{css}</style>
        </Padding>
      </div>
      <DisplayProduct />
    </React.Fragment>
  );
}

function DisplayProduct() {
  const { products } = useSelector(
    (state) => state.fireBase?.extensions?.realTime
  );

  const baseSize = 3;
  const [listNew, setListNew] = React.useState([]);
  const [listPrice, setListPrice] = React.useState([]);

  React.useEffect(() => {
    if (products === undefined) return;

    const arrayListNew = structuredClone(products);
    arrayListNew.sort((a, b) => {
      const xDate = a?.coBan?.ngayNhap?.split("-");
      const yDate = b?.coBan?.ngayNhap?.split("-");

      if (xDate[0] < yDate[0]) return 1;
      if (xDate[0] > yDate[0]) return -1;

      if (xDate[1] < yDate[1]) return 1;
      if (xDate[1] > yDate[1]) return -1;

      if (xDate[2] < yDate[2]) return 1;
      if (xDate[2] > yDate[2]) return -1;

      return 0;
    });

    const lengthListNew = arrayListNew.length;
    setListNew(
      arrayListNew.slice(0, lengthListNew < baseSize ? lengthListNew : baseSize)
    );

    const arrayListPrice = structuredClone(products);
    arrayListPrice.sort((a, b) => {
      const xPrice = a?.coBan?.gia - (a?.coBan?.gia * a?.coBan?.giamGia) / 100;
      const yPrice = b?.coBan?.gia - (b?.coBan?.gia * b?.coBan?.giamGia) / 100;
      return xPrice - yPrice;
    });

    const lengthListPrice = arrayListPrice.length;
    setListPrice(
      arrayListPrice.slice(
        0,
        lengthListPrice < baseSize ? lengthListPrice : baseSize
      )
    );
  }, [products]);

  return (
    <React.Fragment>
      <DisplayDetail label="Sản phẩm mới" product={listNew} />
      <DisplayDetail label="Sản phẩm giá thấp" product={listPrice} />
    </React.Fragment>
  );
}

function DisplayDetail(props) {
  const { label, product } = props;

  const navigate = useNavigate();

  const itemStyle = {
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  const productStyle = {
    width: "15rem",
    fontSize: "1.2rem",
    cursor: "pointer",
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
  };

  const nameStyle = {
    overflow: "hidden",
    wordBreak: "break-all",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const priceStyle = {
    color: "darkred",
  };

  return (
    <React.Fragment>
      <Padding all={3}>
        <h4>{label}</h4>
        <div style={itemStyle}>
          <Padding all={2}>
            <Row mainAxisAlign={AxisAlign.spaceAround}>
              {product.map((item, index) => (
                <React.Fragment key={index}>
                  <div
                    style={productStyle}
                    onClick={() => navigate(`SanPham/ChiTiet/${item?.id}`)}
                  >
                    <Image
                      style={{ width: "100%" }}
                      src={item?.coBan?.hinhAnh[0]}
                    />
                    <Padding all={1}>
                      <b style={nameStyle}>{item?.coBan?.ten}</b>
                      {item?.coBan?.giamGia === 0 ? (
                        <React.Fragment>
                          <div style={priceStyle}>
                            {thousandDot(item?.coBan?.gia)} <u>đ</u>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <del>
                            {thousandDot(item?.coBan?.gia)} <u>đ</u>
                          </del>
                          <div style={priceStyle}>
                            {thousandDot(
                              item?.coBan?.gia -
                                (item?.coBan?.gia * item?.coBan?.giamGia) / 100
                            )}{" "}
                            <u>đ</u> -{item?.coBan?.giamGia}%
                          </div>
                        </React.Fragment>
                      )}
                    </Padding>
                  </div>
                </React.Fragment>
              ))}
            </Row>
          </Padding>
        </div>
      </Padding>
    </React.Fragment>
  );
}

export default DashboardClient;
