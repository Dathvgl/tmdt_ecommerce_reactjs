import axios from "axios";
import { RatingStar } from "rating-star";
import React from "react";
import { Button, Form, ProgressBar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  AxisAlign,
  AxisSize,
  Column,
  Padding,
  Row,
  SizedBox,
} from "../Components/Layout";
import { Center } from "../Components/Widget";
import { thousandDot } from "../Function";
import { setExtensions } from "../React/Actions/Firebase/Actions";
import DetailItem from "./DetailItem";
import "react-toastify/dist/ReactToastify.css";
import { Image } from "antd";
import { PopupDialog } from "../ComponentsTSX";

function SpecificItemClient() {
  const node = process.env?.REACT_APP_NODE;

  const navigate = useNavigate();

  const { id } = useParams();
  const { currentInfo } = useSelector((state) => state?.user);

  const product = useSelector((state) =>
    state?.fireBase?.extensions?.realTime?.products?.find((x) => x.id === id)
  );

  const hinhAnh = product ? Object.values(product?.coBan?.hinhAnh) : [];

  const baseWidth = () => {
    const widthAll = { left: 0, right: 0, space: 0 };

    const widthSpace = 5;

    const widthLeft = 45 - widthSpace / 2;
    const widthRight = 100 - widthLeft - widthSpace;

    widthAll.left = `${widthLeft}%`;
    widthAll.right = `${widthRight}%`;
    widthAll.space = `${widthSpace}%`;

    return widthAll;
  };

  const colWidth = baseWidth();

  const css = `
    .carousel-slider {
      border-radius: 0.5rem;
    }
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

  const infoLaptop = () => {
    if (product === undefined) return;

    const widgets = [];

    const {
      kichThuocManHinh: mh_kt,
      doPhanGiai: mh_pg,
      tamNen: mh_tn,
      tanSoQuet: mh_ts,
      congNgheManHinh: mh_mh,
    } = product?.manHinh;

    const mh = `${mh_kt}, ${mh_pg}, ${mh_tn}, ${mh_ts}, ${mh_mh}`;
    widgets.push(<div>{mh}</div>);

    const { cpu: cpu_cpu, loaiCPU: cpu_lcpu } = product?.boXuLy;

    const cpu = `${cpu_cpu}, ${cpu_lcpu}`;
    widgets.push(<div>{cpu}</div>);

    const {
      ram: ram_ram,
      chuThichRAM: ram_ct,
      loaiRAM: ram_lram,
      tocDoRAM: ram_td,
    } = product?.RAM;

    const ram = `${ram_ram}${
      ram_ct === "" && ram_ct === undefined ? "" : ram_ct
    }, ${ram_lram}, ${ram_td}`;
    widgets.push(<div>{ram}</div>);

    const { oCung } = product?.luuTru;
    widgets.push(<div>{oCung}</div>);

    const { cardOnboard: card_o, cardRoi: card_r } = product?.doHoa;

    const dh_r =
      card_r?.hang === "" ? "" : `${card_r?.hang} ${card_r?.model}; `;
    const dh_o = `${card_o?.hang} ${card_o?.model}`;
    const dh = dh_r + dh_o;
    widgets.push(<div>{dh}</div>);

    return widgets;
  };

  const [detailed, setDetailed] = React.useState(false);
  const [racmted, setRacmted] = React.useState(false);

  const onClickDetailed = () => setDetailed(true);
  const onClickRacmted = React.useCallback(() => {
    if (!currentInfo) {
      navigate("/Login/SignIn");
      return;
    }

    if (currentInfo?.hoTen === "") {
      navigate("/UserProfile");
      return;
    }

    setRacmted(true);
  }, [currentInfo, navigate]);

  const callbackDetailed = React.useCallback(() => {
    setDetailed(false);
    setRacmted(false);
  }, []);

  const onClickedOrder = async () => {
    if (product === undefined) return;
    if (product?.coBan?.soLuong <= 0) {
      notify();
      return;
    }

    const cartDetailObj = {
      id: "",
      ten: "",
      hinhAnh: "",
      giaGoc: 0,
      giamGia: 0,
      soLuong: 0,
      giaTong: 0,
    };

    const gia = Number(product?.coBan?.gia);
    const giamGia = !product?.coBan?.giamGia
      ? 0
      : Number(product?.coBan?.giamGia);

    const userId = currentInfo?.id;

    const cart = structuredClone(cartDetailObj);
    cart.id = product?.id;
    cart.ten = product?.coBan?.ten;
    cart.hinhAnh = product?.coBan?.hinhAnh[0];
    cart.giaGoc = gia - (gia * giamGia) / 100;
    cart.giamGia = giamGia;
    cart.soLuong = 1;
    cart.giaTong = cart?.giaGoc * cart?.soLuong;

    if (!currentInfo) {
      const order = JSON.parse(localStorage.getItem("order") || "[]");
      if (order?.some((item) => item?.id === cart.id)) {
        return;
      }

      order?.push(cart);
      localStorage.setItem("order", JSON.stringify(order));
    } else await axios.post(`${node}/cart/${userId}/carted`, { item: cart });
  };

  const notify = () => toast("Sản phẩm này đang hết hàng");

  return (
    <React.Fragment>
      {detailed && (
        <PopupDialog width={"50vw"} callback={callbackDetailed}>
          <DetailItem display={detailed} item={product} />
        </PopupDialog>
      )}
      {racmted && (
        <PopupDialog width={"50vw"} centered callback={callbackDetailed}>
          <RateCommentType
            productId={product?.id}
            rate={product?.coBan?.danhGia}
            totalRate={product?.coBan?.tongDanhGia}
            callback={callbackDetailed}
            display={racmted}
          />
        </PopupDialog>
      )}
      <Padding all={3}>
        <h3>{product?.coBan?.ten}</h3>
        <hr />
        <Row crossAxisAlign={AxisAlign.start}>
          <div style={{ width: colWidth.left }}>
            <Carousel
              showArrows={false}
              showThumbs={false}
              emulateTouch
              infiniteLoop
            >
              {hinhAnh?.map((item, index) => (
                <React.Fragment key={index}>
                  <Image src={item} />
                </React.Fragment>
              ))}
            </Carousel>
            <style>{css}</style>
            <SizedBox height="1rem" />
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
              <Padding all="1rem">
                {infoLaptop()?.map((item, index) => (
                  <React.Fragment key={index}>{item}</React.Fragment>
                ))}
                <div style={{ color: "blue" }}>
                  <span style={{ cursor: "pointer" }} onClick={onClickDetailed}>
                    Xem chi tiết thông số kỹ thuật
                  </span>
                </div>
              </Padding>
            </div>
          </div>
          <SizedBox width={colWidth.space} />
          <div style={{ ...{ width: colWidth.right } }}>
            <Row mainAxisAlign={AxisAlign.spaceBetween}>
              <h2 style={{ color: "darkred" }}>
                {thousandDot(product?.coBan?.gia)} <u>đ</u>
              </h2>
              <Button onClick={onClickedOrder}>Thêm vào giỏ hàng</Button>
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
          </div>
        </Row>
      </Padding>
      <RateComment
        productId={product?.id}
        rate={product?.coBan?.danhGia}
        totalRate={product?.coBan?.tongDanhGia}
        callback={onClickRacmted}
      />
    </React.Fragment>
  );
}

function RateComment(props) {
  const node = process.env?.REACT_APP_NODE;

  const { productId, rate, totalRate, callback } = props;

  const css = `
    .cMkWlf {
      padding: 0;
    }
  `;

  const progressStyle = {
    width: "30rem",
    margin: "0 1rem",
  };

  const labelRateStyle = { width: "3rem" };

  const [rated, setRated] = React.useState({});
  const [commented, setCommented] = React.useState([]);

  React.useEffect(() => {
    async function getRacmted() {
      const res = await axios.get(`${node}/product/racmt/${productId}`);
      const { data } = res;

      setRated(data?.rated);

      delete data?.rated;
      setCommented(
        Object.keys(data).map((item) => ({ ...data[item], id: item }))
      );
    }

    getRacmted();
  }, [node, productId]);

  return (
    <React.Fragment>
      <Padding horizontal={3} bottom={3}>
        <h4>Đánh giá - Nhận xét từ khách hàng</h4>
        <div style={{ borderRadius: "1rem", backgroundColor: "white" }}>
          <Padding all={2}>
            <Row style={{ marginBottom: "1rem" }}>
              <h3>{rate}</h3>
              <div style={{ margin: "0 1rem" }}>
                <RatingStar id="rated" rating={5} />
                <Center>{totalRate} nhận xét</Center>
                <style>{css}</style>
              </div>
              <Button onClick={callback}>Đánh giá</Button>
            </Row>
            <Row>
              <RatingStar id="5" rating={5} />
              <ProgressBar
                style={progressStyle}
                now={totalRate === 0 ? 0 : (rated[5] / totalRate) * 100}
              />
              <strong style={labelRateStyle}>{rated[5]}</strong>
            </Row>
            <Row>
              <RatingStar id="4" rating={4} />
              <ProgressBar
                style={progressStyle}
                now={totalRate === 0 ? 0 : (rated[4] / totalRate) * 100}
              />
              <strong style={labelRateStyle}>{rated[4]}</strong>
            </Row>
            <Row>
              <RatingStar id="3" rating={3} />
              <ProgressBar
                style={progressStyle}
                now={totalRate === 0 ? 0 : (rated[3] / totalRate) * 100}
              />
              <strong style={labelRateStyle}>{rated[3]}</strong>
            </Row>
            <Row>
              <RatingStar id="2" rating={2} />
              <ProgressBar
                style={progressStyle}
                now={totalRate === 0 ? 0 : (rated[2] / totalRate) * 100}
              />
              <strong style={labelRateStyle}>{rated[2]}</strong>
            </Row>
            <Row>
              <RatingStar id="1" rating={1} />
              <ProgressBar
                style={progressStyle}
                now={totalRate === 0 ? 0 : (rated[1] / totalRate) * 100}
              />
              <strong style={labelRateStyle}>{rated[1]}</strong>
            </Row>
            <hr />
            {commented.length === 0 ? (
              <React.Fragment>
                <h5>Không có người nào bình luận</h5>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {commented?.map((item, index, { length }) => (
                  <React.Fragment key={index}>
                    <Row mainAxisAlign={AxisAlign.start}>
                      <div style={{ width: "20rem" }}>
                        <div>{item?.hoTen}</div>
                        <div>{item?.racmtDate}</div>
                      </div>
                      <div>
                        <RatingStar id={item?.id} rating={item?.rate} />
                        <div>{item?.comment}</div>
                      </div>
                    </Row>
                    {index !== length - 1 && <hr />}
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </Padding>
        </div>
      </Padding>
    </React.Fragment>
  );
}

function RateCommentType(props) {
  const node = process.env?.REACT_APP_NODE;

  const dispatch = useDispatch();

  const { productId, rate, totalRate, callback } = props;

  const { currentInfo } = useSelector((state) => state?.user);
  const { extensions } = useSelector((state) => state?.fireBase);
  const { realTime } = useSelector((state) => state.fireBase?.extensions);

  const [rating, setRating] = React.useState(1);
  const [comment, setComment] = React.useState("");

  const onRatingChange = (val) => {
    setRating(val);
  };

  const onChangeInput = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const onRacmtSubmit = async () => {
    const item = {
      userId: currentInfo?.id,
      hoTen: currentInfo?.hoTen,
      rating,
      comment,
      newRate: (rate * totalRate + rating) / (totalRate + 1),
      newTotalRate: totalRate + 1,
    };

    await axios.post(`${node}/product/racmt/${productId}`, { item });
    callback();

    const res = await axios.get(`${node}/product`);
    const { data } = res;

    dispatch(
      setExtensions({
        extensions: {
          ...extensions,
          realTime: {
            ...realTime,
            products: Object.keys(data).map((item) => ({
              ...data[item],
              id: item,
            })),
          },
        },
      })
    );

    window.location.reload();
  };

  return (
    <React.Fragment>
      <Padding all={2}>
        <Column style={{ justifyItems: "unset" }}>
          <Row mainAxisSize={AxisSize.min}>
            <b style={{ marginRight: "0.5rem" }}>Mức độ hài lòng:</b>
            <RatingStar
              id="rating"
              clickable
              rating={rating}
              onRatingChange={onRatingChange}
            />
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Bạn có hài lòng về sản phẩm?</b>
            </Form.Label>
            <Form.Control
              placeholder="Hãy chia sẻ cảm nhận, đánh giá của bạn về sản phẩm này."
              as="textarea"
              rows={3}
              onChange={onChangeInput}
            />
          </Form.Group>
          <Row>
            <Button onClick={onRacmtSubmit}>Gửi nhận xét - đánh giá</Button>
          </Row>
        </Column>
      </Padding>
    </React.Fragment>
  );
}

export default SpecificItemClient;
