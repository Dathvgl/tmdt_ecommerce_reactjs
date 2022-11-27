import { Button, Drawer, Image, Switch, Upload } from "antd";
import axios from "axios";
import React from "react";
import { Form } from "react-bootstrap";
import { BiMinusCircle } from "react-icons/bi";
import { MdAddCircleOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  AxisAlign,
  AxisSize,
  Column,
  Padding,
  Row,
  SizedBox,
} from "../Components/Layout";
import { TableRes } from "../ComponentsTSX";
import { thousandDot } from "../Function";
import { ProductLabel, ProductObj } from "../Model/Product.model";

function ProductAdmin() {
  const node = process.env?.REACT_APP_NODE;

  const { categories } = useSelector(
    (state) => state.fireBase?.extensions?.fireStore
  );

  const [products, setProducts] = React.useState([]);

  const getProducts = React.useCallback(async () => {
    const res = await axios.get(`${node}/product`);
    const { data } = res;
    setProducts(Object.keys(data).map((item) => ({ ...data[item], id: item })));
  }, [node]);

  React.useEffect(() => {
    getProducts();
  }, [getProducts]);

  const itemStyle = {
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  const motto = React.useCallback(
    async (item) => {
      const { id, check, soLuong, soLuongGoc } = item;
      if (check) {
        await axios
          .put(`${node}/product/${id}/quantity`, {
            quantity: soLuong,
          })
          .then((_) => getProducts());
      } else {
        if (soLuongGoc >= soLuong) {
          await axios
            .put(`${node}/product/${id}/quantity`, {
              quantity: soLuong * -1,
            })
            .then((_) => getProducts());
        }
      }
    },
    [getProducts, node]
  );

  const MottoDetail = (props) => {
    const { id, soLuong, callback } = props;

    const [quantity, setQuantity] = React.useState(0);

    const onChangeInput = (e) => {
      const { value } = e.target;
      if (value === "") setQuantity(0);
      else setQuantity(Number.parseInt(value));
    };

    return (
      <React.Fragment>
        <Row mainAxisSize={AxisSize.min}>
          <div>{thousandDot(soLuong)}</div>
          <Form.Control
            value={quantity}
            onChange={onChangeInput}
            style={{ width: "4rem", margin: "0 1rem" }}
          />
          <MdAddCircleOutline
            style={{ cursor: "pointer" }}
            size="1.5rem"
            onClick={() =>
              callback({
                id: id,
                check: true,
                soLuong: quantity,
                soLuongGoc: soLuong,
              })
            }
          />
          <BiMinusCircle
            style={{ cursor: "pointer" }}
            size="1.5rem"
            onClick={() =>
              callback({
                id: id,
                check: false,
                soLuong: quantity,
                soLuongGoc: soLuong,
              })
            }
          />
        </Row>
      </React.Fragment>
    );
  };

  const StateDetail = (props) => {
    const { id, tinhTrang } = props;

    const [check, setCheck] = React.useState(tinhTrang === "on" ? true : false);

    const onClickSwitch = async (value) => {
      setCheck(value);

      await axios
        .put(`${node}/product/${id}/state`, {
          state: value ? "on" : "off",
        })
        .then((_) => getProducts());
    };

    return (
      <React.Fragment>
        <Switch checked={check} onChange={onClickSwitch} />
      </React.Fragment>
    );
  };

  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div style={itemStyle}>
        <Padding all={2}>
          <Button onClick={showDrawer}>Thêm sản phẩm</Button>
          <Drawer
            width={"50%"}
            title="Thêm sản phẩm"
            placement="right"
            onClose={onClose}
            open={open}
            headerStyle={{ backgroundColor: "lightgrey" }}
          >
            <AddProduct
              categories={(() => {
                const list = categories?.map(({ label, list }) => ({
                  label: label,
                  list: list,
                }));
                return list;
              })()}
              callback={onClose}
            />
          </Drawer>
        </Padding>
      </div>
      <SizedBox height="2rem" />
      <div style={itemStyle}>
        <Padding all={1}>
          <TableRes
            columns={[
              {
                title: "Hình ảnh",
                dataIndex: "hinhAnh",
                render: (_, { hinhAnh }) => (
                  <React.Fragment>
                    <Image style={{ width: "5rem" }} src={hinhAnh} />
                  </React.Fragment>
                ),
              },
              {
                title: "Tên sản phẩm",
                dataIndex: "ten",
                sorter: (a, b) => a?.ten.localeCompare(b?.ten),
                render: (_, { ten }) => {
                  const textStyle = {
                    width: "10rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  };

                  return (
                    <React.Fragment>
                      <div style={textStyle}>{ten}</div>
                    </React.Fragment>
                  );
                },
              },
              {
                title: "Số lượng",
                dataIndex: "soLuong",
                sorter: (a, b) => a?.soLuong - b?.soLuong,
                render: (_, { id, soLuong }) => (
                  <React.Fragment>
                    <MottoDetail id={id} soLuong={soLuong} callback={motto} />
                  </React.Fragment>
                ),
              },
              {
                title: "Giá sản phẩm",
                dataIndex: "gia",
                sorter: (a, b) =>
                  a?.gia -
                  (a?.gia * a?.giamGia) / 100 -
                  (b?.gia - (b?.gia * b?.giamGia) / 100),
                render: (_, { gia, giamGia }) => {
                  const priceStyle = {
                    color: "darkred",
                  };

                  return (
                    <React.Fragment>
                      {giamGia === 0 ? (
                        <React.Fragment>
                          <div style={priceStyle}>
                            {thousandDot(gia)} <u>đ</u>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div>
                            <del>
                              {thousandDot(gia)} <u>đ</u>
                            </del>
                            <div style={priceStyle}>
                              {thousandDot(gia - (gia * giamGia) / 100)}{" "}
                              <u>đ</u> -{giamGia}%
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  );
                },
              },
              {
                title: "Tình trạng",
                dataIndex: "tinhTrang",
                filters: [
                  {
                    text: "Không bán",
                    value: "off",
                  },
                  {
                    text: "Đang bán",
                    value: "on",
                  },
                ],
                filterSearch: true,
                onFilter: (value, record) => {
                  return record?.contains(value);
                },
                render: (_, { id, tinhTrang }) => (
                  <React.Fragment>
                    <StateDetail id={id} tinhTrang={tinhTrang} />
                  </React.Fragment>
                ),
              },
            ]}
            data={products.map(
              (
                {
                  id,
                  coBan: { hinhAnh, ten, soLuong, gia, giamGia, tinhTrang },
                },
                index
              ) => ({
                key: index,
                id,
                ten,
                hinhAnh: hinhAnh === undefined ? "" : hinhAnh[0],
                soLuong,
                gia,
                giamGia,
                tinhTrang,
              })
            )}
          />
        </Padding>
      </div>
    </React.Fragment>
  );
}

function AddProduct(props) {
  const node = process.env?.REACT_APP_NODE;

  const { callback, categories } = props;

  const [detail, setDetail] = React.useState(structuredClone(ProductObj));

  const onUpdateDetail = React.useCallback((item, child, value) => {
    setDetail((obj) => ({ ...obj, [item]: { ...obj[item], [child]: value } }));
  }, []);

  const listAttribute = [
    {
      label: [ProductLabel[0], ProductLabel[2]],
      data: (() => {
        const { coBan, thietKeTrongLuong } = detail;
        return { coBan, thietKeTrongLuong };
      })(),
      selected: (() => {
        const need = ["nhuCau", "tinhNang"];
        const list = categories?.filter((item) => need?.includes(item?.label));
        return list;
      })(),
      callback: onUpdateDetail,
    },
    {
      label: [ProductLabel[1], ProductLabel[12]],
      data: (() => {
        const { thongTin, heDieuHanh } = detail;
        return { thongTin, heDieuHanh };
      })(),
      selected: [],
      callback: onUpdateDetail,
    },
    {
      label: [ProductLabel[3], ProductLabel[6]],
      data: (() => {
        const { boXuLy, doHoa } = detail;
        return { boXuLy, doHoa };
      })(),
      selected: (() => {
        const need = ["cpu"];
        const list = categories?.filter((item) => need?.includes(item?.label));
        return list;
      })(),
      callback: onUpdateDetail,
    },
    {
      label: [ProductLabel[4], ProductLabel[7]],
      data: (() => {
        const { RAM, luuTru } = detail;
        return { RAM, luuTru };
      })(),
      selected: (() => {
        const need = ["ram", "oCung"];
        const list = categories?.filter((item) => need?.includes(item?.label));
        return list;
      })(),
      callback: onUpdateDetail,
    },
    {
      label: [ProductLabel[5], ProductLabel[9]],
      data: (() => {
        const { manHinh, amThanh } = detail;
        return { manHinh, amThanh };
      })(),
      selected: [],
      callback: onUpdateDetail,
    },
    {
      label: [ProductLabel[8], ProductLabel[10], ProductLabel[11]],
      data: (() => {
        const { giaoTiepKetNoi, banPhimTouchPad, thongTinPinSac } = detail;
        return { giaoTiepKetNoi, banPhimTouchPad, thongTinPinSac };
      })(),
      selected: [],
      callback: onUpdateDetail,
    },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    postProduct(detail);
  };

  const postProduct = async (item) => {
    const alt = new FormData();

    item?.coBan?.hinhAnh?.forEach((file) => {
      alt.append("hinhAnh", file);
    });
    delete item.coBan.hinhAnh;

    Object.keys(item)?.forEach((key) => {
      alt.append([key], JSON.stringify(item[key]));
    });

    await axios
      .post(`${node}/product`, alt, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((_) => callback());
  };

  return (
    <React.Fragment>
      <Padding horizontal="2rem" top="2rem">
        <Column
          mainAxisAlign={AxisAlign.start}
          crossAxisAlign={AxisAlign.spaceBetween}
        >
          <Column>
            {listAttribute.map((item, index) => (
              <React.Fragment key={index}>
                <FormProduct {...item} />
                <SizedBox width="100%" height="2rem" />
              </React.Fragment>
            ))}
          </Column>
          <Column>
            <Button type="primary" onClick={onSubmit}>
              Thêm sản phẩm
            </Button>
            <SizedBox width="100%" height="2rem" />
          </Column>
        </Column>
      </Padding>
    </React.Fragment>
  );
}

function FormProduct(props) {
  const data = props?.data;
  const label = props?.label;

  const images = data?.coBan?.hinhAnh;
  const widthBox = "60%";
  const listSelected = props?.selected;

  const propsBox = {
    size: "lg",
    style: { width: widthBox },
    autoComplete: "off",
  };

  const hrStyle = {
    width: "100%",
    border: "0.25rem black solid",
    borderRadius: "50rem",
    opacity: "1",
  };

  const [listData, setListData] = React.useState([]);

  React.useEffect(() => {
    Object.keys(data).forEach((item) => {
      const list = [];
      Object.keys(data[item]).forEach((child) => {
        const name = `${item}-${child}`;
        list.push(name);
      });
      setListData((obj) => [...obj, list]);
    });
  }, [data]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    const [item = "", child = ""] = name?.split(/[.-]/);
    props?.callback(item, child, value);
  };

  const onChangeInputDark = (e, dark) => {
    const { name, value } = e.target;
    const [item = "", child = ""] = name?.split(/[.-]/);
    props?.callback(item, child, { ...data[item][child], [dark]: value });
  };

  const propsUpload = {
    style: { width: "100%" },
    name: "file",
    multiple: true,
    accept: ".png,.jpg,.jpeg",
    listType: "picture",
    customRequest({ file, onSuccess }) {
      const { uid } = file;

      const check = data?.coBan?.hinhAnh?.some((item) => uid === item?.uid);

      if (!check) {
        images.push(file);

        const e = { target: { name: "", value: [] } };
        e.target.name = "coBan-hinhAnh";
        e.target.value = images;

        onChangeInput(e);
      }

      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      const e = { target: { name: "", value: [] } };
      e.target.name = "coBan-hinhAnh";
      e.target.value = images?.filter((item) => item?.uid !== file?.uid);
      onChangeInput(e);
    },
  };

  return (
    <React.Fragment>
      {Object.keys(data)?.map((item, index, { length }) => (
        <React.Fragment key={index}>
          <Row mainAxisAlign={AxisAlign.start}>
            <h4>{label[index]?.base}</h4>
          </Row>
          {item === "doHoa" && (
            <React.Fragment key={index}>
              {Object.keys(data[item])?.map((child, count, { length }) => (
                <React.Fragment key={count}>
                  <h5>{label[index]?.child[count]?.deep}</h5>
                  {Object.keys(data[item][child])?.map((dark, num) => (
                    <React.Fragment key={num}>
                      <Row mainAxisAlign={AxisAlign.spaceBetween}>
                        <b>{label[index]?.child[count]?.children[num]}</b>
                        <Form.Control
                          name={
                            listData.length === 0
                              ? dark
                              : listData[index][count]
                          }
                          {...propsBox}
                          placeholder={
                            label[index]?.child[count]?.children[num]
                          }
                          defaultValue={data[item][child][dark]}
                          onChange={(e) => onChangeInputDark(e, dark)}
                        />
                      </Row>
                    </React.Fragment>
                  ))}
                  {count + 1 !== length && (
                    <SizedBox width="100%" height="1.5rem" />
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
          {item !== "doHoa" && (
            <React.Fragment key={index}>
              {Object.keys(data[item])?.map((child, count) => (
                <React.Fragment key={count}>
                  <SizedBox width="100%" height="1.5rem" />
                  <Row mainAxisAlign={AxisAlign.spaceBetween}>
                    <b>{label[index]?.child[count]}</b>
                    {!listSelected?.some((x) => x.label === child) ? (
                      <React.Fragment>
                        {child === "hinhAnh" && (
                          <React.Fragment>
                            <div style={{ width: widthBox }}>
                              {/* <ProductImage
                                hinhAnh={data?.coBan?.hinhAnh}
                                callback={onChangeInput}
                              /> */}
                              <Upload.Dragger {...propsUpload}>
                                <div>Chọn hoặc kéo thả ảnh</div>
                              </Upload.Dragger>
                            </div>
                          </React.Fragment>
                        )}
                        {child !== "hinhAnh" && (
                          <React.Fragment>
                            <Form.Control
                              name={
                                listData.length === 0
                                  ? child
                                  : listData[index][count]
                              }
                              {...propsBox}
                              placeholder={label[index]?.child[count]}
                              defaultValue={data[item][child]}
                              onChange={onChangeInput}
                            />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Form.Select
                          name={
                            listData.length === 0
                              ? child
                              : listData[index][count]
                          }
                          size="lg"
                          style={{ width: widthBox }}
                          defaultValue={data[item][child]}
                          onChange={onChangeInput}
                        >
                          <option value="" disabled hidden>
                            Chọn ở đây
                          </option>
                          {listSelected
                            .find((x) => x.label === child)
                            ?.list.map((item, index) => (
                              <React.Fragment key={index}>
                                <option value={item}>{item}</option>
                              </React.Fragment>
                            ))}
                        </Form.Select>
                      </React.Fragment>
                    )}
                  </Row>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
          {index + 1 !== length && <hr style={hrStyle} />}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

export default ProductAdmin;
