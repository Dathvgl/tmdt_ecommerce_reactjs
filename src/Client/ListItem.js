import React from "react";
import axios from "axios";
import { Button, Form, Image } from "react-bootstrap";
import { AiFillStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { PageIndex } from "../ComponentsJS";
import {
  AxisAlign,
  AxisSize,
  Padding,
  Row,
  SizedBox,
} from "../Components/Layout";
import { thousandDot } from "../Function";
import "react-toastify/dist/ReactToastify.css";

function ListItemClient() {
  const { categories } = useSelector(
    (state) => state.fireBase?.extensions?.fireStore
  );

  const { products } = useSelector(
    (state) => state.fireBase?.extensions?.realTime
  );

  const [productsList, setProductsList] = React.useState([]);

  const [search, setSearch] = React.useState({
    coBan: {
      gia: null,
      tinhNang: null,
      nhuCau: null,
    },
    thongTin: { thuongHieu: null },
    boXuLy: { cpu: null },
    RAM: { ram: null },
    manHinh: { kichThuocManHinh: null },
    doHoa: { card: null },
    luuTru: { oCung: null },
  });

  React.useEffect(() => {
    if (products === undefined) return;
    setProductsList(structuredClone(products));
  }, [products]);

  React.useEffect(() => {
    let real = false;
    let once = false;
    let clone = structuredClone(products);
    Object.keys(search)?.forEach((item) => {
      let filtered = [];
      Object.keys(search[item])?.forEach((child) => {
        const array = structuredClone(search[item][child]);
        if (array === null) return;
        once = true;
        array?.forEach((x) => {
          const find = clone?.filter((fill) => {
            const short =
              fill[item][child] === undefined ? null : fill[item][child];
            const exclude = ["gia", "kichThuocManHinh", "card"];

            if (!exclude.includes(child)) return short === x;

            if (child === "card") {
              if (x !== "Card Onboard") {
                const cardRoi = fill[item]["cardRoi"];
                if (cardRoi !== undefined && cardRoi !== "") {
                  return x?.split(" ")?.some((y) => cardRoi?.includes(y));
                }

                const cardOnboard = fill[item]["cardOnboard"];
                return x?.split(" ")?.some((y) => cardOnboard?.includes(y));
              }

              const cardRoi = fill[item]["cardRoi"];
              return cardRoi === undefined && cardRoi === "";
            }

            if (child === "kichThuocManHinh") {
              const inch = short?.split(" ")[0];
              return inch >= x || inch < x + 1;
            }

            const million = 1000000;
            const start = x[0] * million;
            const end = x[1] * million;

            if (end === 0) return short >= start;

            return short >= start && short < end;
          });

          if (find.length !== 0) filtered?.push(...find);
        });
      });

      if (filtered.length !== 0) {
        if (!real) {
          real = true;
          clone = structuredClone(filtered);
        } else clone?.push(...filtered);
      }

      if (!real && once) clone = [];
    });

    setProductsList(structuredClone(clone));
  }, [products, search]);

  const baseWidth = () => {
    const widthAll = { left: 0, right: 0, space: 0 };

    const widthSpace = 2;

    const widthLeft = 25 - widthSpace / 2;
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

  const filterBox = React.useCallback((obj) => {
    // Hãng Sản Xuất (hangSanXuat) - thongTin-thuongHieu
    // Mức Giá* (mucGia) - coBan-gia (có lẽ giá sau giảm?)
    // Màn Hình* (manHinh) - manHinh-kichThuocManHinh
    // CPU (cpu) - boXuLy-cpu
    // RAM (ram) - RAM-ram
    // Card Đồ Họa* (cardDoHoa) - doHoa-(cardRoi -> cardOnboard)
    // Ổ Cứng (oCung) - luuTru-oCung ???
    // Tính Năng Đặc Biệt (tinhNang) - coBan-tinhNang
    // Nhu Cầu (nhuCau) - coBan-nhuCau

    const { name, value } = obj;
    switch (name) {
      case "hangSanXuat":
        setSearch((obj) => ({
          ...obj,
          thongTin: { ...obj?.thongTin, thuongHieu: value },
        }));
        break;
      case "mucGia":
        setSearch((obj) => ({
          ...obj,
          coBan: { ...obj?.coBan, gia: value },
        }));
        break;
      case "manHinh":
        setSearch((obj) => ({
          ...obj,
          manHinh: { ...obj?.manHinh, kichThuocManHinh: value },
        }));
        break;
      case "cpu":
        setSearch((obj) => ({
          ...obj,
          boXuLy: { ...obj?.boXuLy, cpu: value },
        }));
        break;
      case "ram":
        setSearch((obj) => ({
          ...obj,
          RAM: { ...obj?.RAM, ram: value },
        }));
        break;
      case "cardDoHoa":
        setSearch((obj) => ({
          ...obj,
          doHoa: { ...obj?.doHoa, card: value },
        }));
        break;
      case "oCung":
        setSearch((obj) => ({
          ...obj,
          luuTru: { ...obj?.luuTru, oCung: value },
        }));
        break;
      case "tinhNang":
        setSearch((obj) => ({
          ...obj,
          coBan: { ...obj?.coBan, tinhNang: value },
        }));
        break;
      case "nhuCau":
        setSearch((obj) => ({
          ...obj,
          coBan: { ...obj?.coBan, nhuCau: value },
        }));
        break;
      default:
        break;
    }
  }, []);

  return (
    <React.Fragment>
      <Padding all={1}>
        <Row crossAxisAlign={AxisAlign.start}>
          <div style={{ ...{ width: colWidth.left }, ...columnStyle }}>
            <Padding all={1}>
              {categories?.map((item, index, { length }) => (
                <React.Fragment key={index}>
                  <FilterItem item={item} callback={filterBox} />
                  {index + 1 !== length && (
                    <React.Fragment>
                      <SizedBox height={1} />
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </Padding>
          </div>
          <SizedBox width={colWidth.space} />
          <div style={{ ...{ width: colWidth.right }, ...columnStyle }}>
            <Padding all={1}>
              <ListItem products={productsList} />
            </Padding>
          </div>
        </Row>
      </Padding>
    </React.Fragment>
  );
}

function FilterItem(props) {
  const { callback } = props;
  const { name, label, list } = props?.item;
  const [checkBoxs, setCheckBoxs] = React.useState([]);

  React.useEffect(() => {
    const items = [{ name: "Tất cả", checked: true }];
    items.push(...list.map((item) => ({ name: item, checked: false })));
    setCheckBoxs(items);
  }, [list]);

  const onCheckedBox = (index) => {
    const listBoxs = [...checkBoxs];
    const obj = {
      name: label,
      value: null,
    };

    if (index !== 0) {
      listBoxs[index].checked = !listBoxs[index]?.checked;
      const base = listBoxs?.some((x) => x.checked);
      listBoxs[0].checked = base ? false : true;

      if (base) {
        obj.value = listBoxs
          ?.filter((item) => item?.checked)
          ?.map((item) => {
            if (label !== "mucGia" && label !== "manHinh") return item?.name;

            const regex = /(\d)/g;

            if (label === "manHinh") {
              return Number(item?.name?.match(regex)?.join(""));
            }

            const price = [0, 0];
            const num = item?.name?.match(regex)?.join("").toString();
            price[0] = Number(num?.slice(0, 2));
            price[1] = Number(num?.slice(2, 4));

            const limited = Number(
              listBoxs[listBoxs.length - 1]?.name
                ?.match(regex)
                ?.join("")
                .toString()
            );

            if (price[1] === 0 && price[0] < limited) {
              price[1] = price[0];
              price[0] = 0;
            }

            return price;
          });
      } else obj.value = null;
    } else {
      listBoxs.forEach((item) => (item.checked = false));
      listBoxs[index].checked = !listBoxs[index]?.checked;
      obj.value = null;
    }

    setCheckBoxs(listBoxs);
    callback(obj);
  };

  const ItemCheckedBox = () => {
    return (
      <React.Fragment>
        {checkBoxs.map((item, index) => (
          <React.Fragment key={index}>
            <Row mainAxisAlign={AxisAlign.start}>
              <Form.Check
                name={label}
                type="checkbox"
                checked={item?.checked}
                onChange={() => onCheckedBox(index)}
              />
              <SizedBox width={0.5} />
              <div>{item?.name}</div>
            </Row>
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <h4>{name}</h4>
      {label !== "hangSanXuat" && <ItemCheckedBox />}
      {label === "hangSanXuat" && (
        <React.Fragment>
          <Row
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(50%, 1fr))",
            }}
            mainAxisAlign={AxisAlign.spaceBetween}
          >
            <ItemCheckedBox />
          </Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function ListItem(props) {
  const node = process.env?.REACT_APP_NODE;

  const { products } = props;
  const itemPage = 5;

  const { currentInfo } = useSelector((state) => state?.user);

  const [renderList, setRenderList] = React.useState([]);

  const defaultAvatar = {
    width: "100%",
  };

  React.useEffect(() => {
    setRenderList(products?.slice(0, itemPage));
  }, [products]);

  const altPage = React.useCallback(
    (x, y) => {
      setRenderList(products?.slice(x, y));
    },
    [products]
  );

  const linkItemStyle = {
    overflow: "hidden",
    wordBreak: "break-all",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
  };

  const onClickOrder = async (product) => {
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

  const priceStyle = {
    color: "darkred",
  };

  const listStyle = {
    width: "15rem",
    border: "0.1rem solid black",
    borderRadius: "0.25rem",
    backgroundColor: "white",
  };

  const imageStyle = {
    border: "0.1rem solid black",
    borderRadius: "0.25rem",
  };

  const notify = () => toast("Sản phẩm này đang hết hàng");

  return (
    <React.Fragment>
      {/* <Row>Lọc sắp xếp</Row> */}
      <Row
        style={{
          flexFlow: "row wrap",
        }}
        mainAxisAlign={AxisAlign.spaceBetween}
      >
        {renderList?.map((item, index) => (
          <React.Fragment key={index}>
            <div style={listStyle}>
              <Padding all={0.5}>
                <div style={imageStyle}>
                  <Image
                    src={item && item?.coBan?.hinhAnh[0]}
                    onError={(e) => console.log(e)}
                    style={defaultAvatar}
                    rounded
                  />
                </div>
                <h5 style={linkItemStyle}>
                  <NavLink to={`/SanPham/ChiTiet/${item?.id}`}>
                    {item?.coBan?.ten}
                  </NavLink>
                </h5>
                <Row mainAxisAlign={AxisAlign.spaceBetween}>
                  {item?.coBan?.giamGia === 0 ? (
                    <React.Fragment>
                      <div style={priceStyle}>
                        {thousandDot(item?.coBan?.gia)} <u>đ</u>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div>
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
                      </div>
                    </React.Fragment>
                  )}
                  <Row mainAxisSize={AxisSize.min}>
                    <b style={{ marginRight: "0.3rem" }}>
                      {item?.coBan?.danhGia}
                    </b>
                    <AiFillStar />
                  </Row>
                </Row>
                <ListItemInfo item={item} />
                <Button
                  style={{ width: "100%", marginTop: "1rem" }}
                  onClick={() => onClickOrder(item)}
                >
                  Thêm vào giỏ hàng
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
          </React.Fragment>
        ))}
      </Row>
      <SizedBox height={2} />
      <Row mainAxisAlign={AxisAlign.end}>
        <PageIndex
          length={products?.length}
          limited={itemPage}
          callback={altPage}
        />
      </Row>
    </React.Fragment>
  );
}

function ListItemInfo(props) {
  const { item } = props;

  const infoLaptop = () => {
    if (item === undefined) return;

    const widgets = [];

    const { kichThuocManHinh: mh_kt } = item?.manHinh;
    widgets.push(<div>{mh_kt}</div>);

    const { cpu: cpu_cpu } = item?.boXuLy;
    widgets.push(<div>{cpu_cpu}</div>);

    const { ram: ram_ram, chuThichRAM: ram_ct } = item?.RAM;
    const ram = `${ram_ram}${
      ram_ct === "" && ram_ct === undefined ? "" : ` ${ram_ct}`
    }`;
    widgets.push(<div>{ram}</div>);

    const { oCung } = item?.luuTru;
    widgets.push(<div>{oCung}</div>);

    const { cardOnboard: card_o, cardRoi: card_r } = item?.doHoa;

    if (card_o !== undefined) {
      const dh_r = `${card_r?.hang} ${card_r?.model}`;
      widgets.push(<div>{dh_r}</div>);
    } else {
      const dh_o = `${card_o?.hang} ${card_o?.model}`;
      widgets.push(<div>{dh_o}</div>);
    }

    return widgets;
  };

  const displayStyle = { overflowY: "hidden", flexFlow: "row wrap" };

  return (
    <React.Fragment>
      <Row style={displayStyle} mainAxisAlign={AxisAlign.spaceBetween}>
        {infoLaptop()?.map((item, index) => (
          <React.Fragment key={index}>{item}</React.Fragment>
        ))}
      </Row>
    </React.Fragment>
  );
}

export default ListItemClient;
