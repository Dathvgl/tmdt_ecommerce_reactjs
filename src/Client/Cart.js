import axios from "axios";
import React from "react";
import { Button, Image } from "react-bootstrap";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsFillCartXFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  AxisAlign,
  Column,
  Padding,
  Row,
  SizedBox,
} from "../Components/Layout";
import { Center, FloatLabel } from "../Components/Widget";
import { thousandDot } from "../Function";
import { Input } from "antd";
import { nanoid } from "nanoid";
import "react-toastify/dist/ReactToastify.css";

function CartClient() {
  const node = process.env?.REACT_APP_NODE;

  const { currentInfo } = useSelector((state) => state?.user);

  const [carted, setCarted] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");
  const [products, setProducts] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);

  const getCart = React.useCallback(async () => {
    const order = JSON.parse(localStorage.getItem("order") || "[]");

    if (!currentInfo) {
      if (order?.length === 0) {
        setCarted(false);
        setOrderId("");
        setProducts([]);
        setTotalPrice(0);
      } else {
        setCarted(true);
        setProducts(order);
        setTotalPrice(
          order?.reduce((prev, current) => prev + current?.giaTong, 0)
        );
      }
      return;
    }

    const { id } = currentInfo;

    if (order?.length !== 0) {
      await Promise.all(
        order?.map(async (item) => {
          await axios.post(`${node}/cart/${id}/carted`, { item });
        })
      );
      localStorage.removeItem("order");
    }

    const data = await (await axios.get(`${node}/cart/${id}`)).data;
    const sanPham = data?.sanPham;
    const { id: orderId, tongTien } = data;

    if (!sanPham) {
      setCarted(false);
      setOrderId("");
      setProducts([]);
      setTotalPrice(0);
      return;
    }

    const sanPhams = Object.keys(sanPham).map((item) => ({
      ...sanPham[item],
      id: item,
    }));

    setCarted(true);
    setOrderId(orderId);
    setProducts(sanPhams);
    setTotalPrice(tongTien);
  }, [currentInfo, node]);

  React.useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <React.Fragment>
      {!carted ? (
        <React.Fragment>
          <CartEmpty />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <CartList
            orderId={orderId}
            products={products}
            totalPrice={totalPrice}
            callbackList={getCart}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function CartEmpty() {
  return (
    <React.Fragment>
      <Center>
        <div style={{ width: "30rem" }}>
          <Padding vertical="5rem">
            <Column>
              <BsFillCartXFill size="7rem" />
              <SizedBox height="0.7rem" />
              <div>Không có sản phẩm trong giỏ hàng</div>
              <SizedBox height="1rem" />
              <Button as={NavLink} to="/">
                Về Trang Chủ
              </Button>
            </Column>
          </Padding>
        </div>
      </Center>
    </React.Fragment>
  );
}

function CartList(props) {
  const node = process.env?.REACT_APP_NODE;

  const { orderId, products, totalPrice, callbackList } = props;

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state?.user);
  const { currentInfo } = useSelector((state) => state?.user);

  const [form, setForm] = React.useState({
    hoTen: "",
    diaChi: "",
  });

  const baseWidth = () => {
    const widthAll = { left: 0, right: 0, space: 0 };

    const widthSpace = 2;

    const widthLeft = 75 - widthSpace / 2;
    const widthRight = 100 - widthLeft - widthSpace;

    widthAll.left = `${widthLeft}%`;
    widthAll.right = `${widthRight}%`;
    widthAll.space = `${widthSpace}%`;

    return widthAll;
  };

  const colWidth = baseWidth();

  const columnStyle = {
    border: "1px black solid",
    borderRadius: "1rem",
    backgroundColor: "white",
  };

  const onClickPayment = async () => {
    const spec = await axios.get(`${node}/product`);
    const { data } = spec;

    const array = Object.keys(data).map((item) => ({
      id: item,
      soLuong: data[item]?.coBan?.soLuong,
    }));

    const check = products?.some(({ id, soLuong }) => {
      const item = array.find((x) => (x.id = id));
      return item.soLuong < soLuong;
    });

    if (check) {
      notify("Có sản phẩm đã hết hàng trong giỏ");
      return;
    }

    if (!currentInfo) {
      if (form.hoTen === "" || form.diaChi === "") {
        notify("Xin nhập đầy đủ thông tin");
        return;
      }

      const user = {
        id: undefined,
        email: undefined,
        diaChi: form.diaChi,
      };

      const obj = await axios.get(`${node}/payment/KhachVangLai`);
      const num = obj.data?.soLuong;

      await axios
        .post(`${node}/payment/create-checkout-session`, {
          user,
          item: products,
        })
        .then(async (res) => {
          if (res.data?.url) {
            window.location.href = res.data?.url;

            const item = {
              id: nanoid(),
              hoTen: form.hoTen,
              diaChi: form.diaChi,
              thanhTien: totalPrice,
            };

            await axios.put(`${node}/payment/KhachVangLai`, {
              num,
              item,
              products,
            });
          }
        })
        .catch((error) => console.error(error));
      return;
    }

    if (currentInfo?.diaChi === "") {
      navigate("/UserProfile");
      return;
    }

    const user = {
      id: currentInfo?.id,
      email: currentUser?.email,
      diaChi: currentInfo?.diaChi,
    };

    const obj = await axios.get(`${node}/payment/${user.id}`);
    const num = obj.data?.soLuong;

    await axios
      .post(`${node}/payment/create-checkout-session`, {
        user,
        item: products,
      })
      .then(async (res) => {
        if (res.data?.url) {
          const { id, hoTen, diaChi } = currentInfo;
          const item = {
            id: orderId,
            hoTen,
            diaChi,
            thanhTien: totalPrice,
          };

          await axios.put(`${node}/payment/${id}`, {
            num,
            item,
            products,
          });

          window.location.href = res.data?.url;
        }
      })
      .catch((error) => console.error(error));
  };

  const notify = (message) => toast(message);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm((obj) => ({ ...obj, [name]: value }));
  };

  const inputStyle = { marginBottom: "1rem" };

  const inputInStyle = { fontSize: "1.2rem" };

  return (
    <React.Fragment>
      <Padding all={2}>
        <Row style={{ width: "100%" }} crossAxisAlign={AxisAlign.start}>
          <div style={{ ...{ width: colWidth.left }, ...columnStyle }}>
            <Padding top={0.5} left={1}>
              <h3 style={{ margin: 0 }}>
                Có {products?.length} sản phẩm trong giỏ hàng
              </h3>
            </Padding>
            <hr />
            {products?.map((item, index) => (
              <React.Fragment key={index}>
                <CartItem item={item} callbackList={callbackList} />
              </React.Fragment>
            ))}
          </div>
          <SizedBox width={colWidth.space} />
          <div style={{ ...{ width: colWidth.right }, ...columnStyle }}>
            <Padding all={1}>
              <h4>Giao tới</h4>
              {!currentInfo ? (
                <React.Fragment>
                  <FloatLabel
                    style={inputStyle}
                    value={form.hoTen}
                    label="Họ tên"
                  >
                    <Input
                      style={inputInStyle}
                      value={form.hoTen}
                      onChange={onChangeInput}
                      name="hoTen"
                      autoComplete="off"
                    />
                  </FloatLabel>
                  <FloatLabel
                    style={inputStyle}
                    value={form.diaChi}
                    label="Địa chỉ"
                  >
                    <Input.TextArea
                      style={inputInStyle}
                      value={form.diaChi}
                      onChange={onChangeInput}
                      name="diaChi"
                      autoComplete="off"
                      autoSize
                    />
                  </FloatLabel>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <strong>{currentInfo?.hoTen}</strong>
                  <div>{currentInfo?.diaChi}</div>
                </React.Fragment>
              )}
              <hr />
              <Padding bottom={1}>
                <Row mainAxisAlign={AxisAlign.spaceBetween}>
                  <div>Tổng tiền là: </div>
                  <div style={{ color: "red", fontSize: "1.5rem" }}>
                    {thousandDot(totalPrice)} <u>đ</u>
                  </div>
                </Row>
              </Padding>
              <Button style={{ width: "100%" }} onClick={onClickPayment}>
                Mua Hàng
              </Button>
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
        </Row>
      </Padding>
    </React.Fragment>
  );
}

function CartItem(props) {
  const node = process.env?.REACT_APP_NODE;

  const { item, callbackList } = props;

  const { currentInfo } = useSelector((state) => state?.user);

  const navigate = useNavigate();

  const [quantity, setQuantity] = React.useState(item?.soLuong);

  const linkItemStyle = {
    cursor: "pointer",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const onClickedLink = () => navigate(`/SanPham/ChiTiet/${item?.id}`);

  const onClickedNumber = async (altNum) => {
    const newQuantity = quantity + altNum;
    if (newQuantity < 0) return;
    setQuantity(newQuantity);

    const cart = item?.id;

    const cartAltObj = {
      soLuong: newQuantity,
      giaTongCu: item?.giaTong,
      giaTongMoi:
        (item?.giaGoc - (item?.giaGoc * item?.giamGia) / 100) * newQuantity,
    };

    if (!currentInfo) {
      const order = JSON.parse(localStorage.getItem("order") || "[]");
      const index = order?.findIndex((obj) => obj?.id === item?.id);
      order[index].soLuong = newQuantity;
      order[index].giaTong =
        (item?.giaGoc - (item?.giaGoc * item?.giamGia) / 100) * newQuantity;
      localStorage.setItem("order", JSON.stringify(order));
    } else {
      const { id } = currentInfo;
      await axios.put(`${node}/cart/${id}/${cart}`, { item: cartAltObj });
    }
    callbackList();
  };

  const onClickedDelete = async () => {
    const cart = item?.id;
    if (!currentInfo) {
      const order = JSON.parse(localStorage.getItem("order") || "[]");
      const array = order?.filter((obj) => obj?.id !== item?.id);
      localStorage.setItem("order", JSON.stringify(array));
    } else {
      const { id } = currentInfo;
      await axios.delete(`${node}/cart/${id}/${cart}`, {
        data: { item: { giaTong: item?.giaTong } },
      });
    }
    callbackList();
  };

  return (
    <React.Fragment>
      <Padding all={1}>
        <Row mainAxisAlign={AxisAlign.spaceBetween}>
          <Row mainAxisAlign={AxisAlign.start}>
            <div style={{ display: "flex" }} onClick={onClickedLink}>
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
            <div>
              <Column style={{ height: "fit-content" }}>
                <div style={{ display: "flex", border: "0.1rem solid black" }}>
                  <Padding
                    style={{ cursor: "pointer" }}
                    horizontal="0.5rem"
                    onClick={() => onClickedNumber(-1)}
                  >
                    <AiOutlineMinus />
                  </Padding>
                  <Padding
                    style={{
                      borderLeft: "0.1rem solid black",
                      borderRight: "0.1rem solid black",
                    }}
                    horizontal="1rem"
                  >
                    {quantity}
                  </Padding>
                  <Padding
                    style={{ cursor: "pointer" }}
                    horizontal="0.5rem"
                    onClick={() => onClickedNumber(1)}
                  >
                    <AiOutlinePlus />
                  </Padding>
                </div>
                <SizedBox height="0.5rem" />
                <Row
                  style={{ cursor: "pointer" }}
                  onClick={() => onClickedDelete()}
                >
                  <MdDelete size="1.25rem" /> Xóa
                </Row>
              </Column>
            </div>
          </Row>
          <div>
            {thousandDot(item?.giaTong)}
            <u>đ</u>
          </div>
        </Row>
      </Padding>
    </React.Fragment>
  );
}

export default CartClient;
