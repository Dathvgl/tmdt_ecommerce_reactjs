import { Button, Dropdown } from "antd";
import axios from "axios";
import React from "react";
import { Padding } from "../Components/Layout";
import { TableRes } from "../ComponentsTSX";
import { thousandDot } from "../Function";

function PaymentAdmin() {
  const node = process.env?.REACT_APP_NODE;

  const time = React.useMemo(
    () => [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ],
    []
  );

  const [timeStart, setTimeStart] = React.useState(0);
  const [timeEnd, setTimeEnd] = React.useState(0);

  const [payments, setPayments] = React.useState([]);

  const getPayments = React.useCallback(async () => {
    const res = await axios.get(`${node}/payment`);
    const { data } = res;

    const array = [];
    data
      ?.map(({ userId, chiTiet }) =>
        Object.keys(chiTiet).map((key) => ({
          ...chiTiet[key],
          userId,
          stt: key,
        }))
      )
      ?.filter((item) => item?.length !== 0)
      ?.forEach((item) => {
        item?.forEach(({ gioHangId, ...all }) => {
          array.push(all);
        });
      });

    array.sort((a, b) => {
      const xSplit = a?.ngayDatHang?.split(":");
      const xDate = xSplit[0]?.split("-");
      const xTime = xSplit[1]?.split("-");

      const ySplit = b?.ngayDatHang?.split(":");
      const yDate = ySplit[0]?.split("-");
      const yTime = ySplit[1]?.split("-");

      if (xDate[0] < yDate[0]) return 1;
      if (xDate[0] > yDate[0]) return -1;

      if (xDate[1] < yDate[1]) return 1;
      if (xDate[1] > yDate[1]) return -1;

      if (xDate[2] < yDate[2]) return 1;
      if (xDate[2] > yDate[2]) return -1;

      if (xTime[0] < yTime[0]) return 1;
      if (xTime[0] > yTime[0]) return -1;

      if (xTime[1] < yTime[1]) return 1;
      if (xTime[1] > yTime[1]) return -1;

      return 0;
    });

    setPayments(array);
  }, [node]);

  React.useEffect(() => {
    getPayments();
  }, [getPayments, node]);

  const itemStyle = {
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  const onAltState = async (item) => {
    const { id, state, stt, items } = item;
    await axios.put(`${node}/payment/${id}/pay`, { state, num: stt, items });
    getPayments();
  };

  const onTableChange = (_, filters, __, ___) => {
    const { ngayDonHang } = filters;
    if (ngayDonHang) {
      const check = { start: false, end: false };

      ngayDonHang?.forEach((item) => {
        const split = item?.split("-");
        const num = Number.parseInt(split[0]);
        const state = split[1];

        if (state === "start") {
          setTimeStart(num);
          check.start = true;
        } else {
          setTimeEnd(num);
          check.end = true;
        }
      });

      if (!check.start) setTimeStart(0);
      if (!check.end) setTimeEnd(0);
    } else {
      setTimeStart(0);
      setTimeEnd(0);
    }
  };

  return (
    <React.Fragment>
      <div style={itemStyle}>
        <Padding all={1}>
          <React.Fragment>
            <TableRes
              onChange={onTableChange}
              columns={[
                {
                  title: "Ngày đơn hàng",
                  dataIndex: "ngayDonHang",
                  filters: [
                    {
                      text: "Từ giờ",
                      value: "start",
                      children: time
                        .slice(0, timeEnd === 0 ? time.length : timeEnd - 1)
                        .map((item) => {
                          const text =
                            item === 12 || item === 24
                              ? `${item} Middle`
                              : item < 12
                              ? `${item} AM`
                              : `${item} PM`;
                          return { text, value: `${item}-start` };
                        }),
                    },
                    {
                      text: "Đến giờ",
                      value: "end",
                      children: time.slice(timeStart).map((item) => {
                        const text =
                          item === 12 || item === 24
                            ? `${item} Middle`
                            : item < 12
                            ? `${item} AM`
                            : `${item} PM`;
                        return { text, value: `${item}-end` };
                      }),
                    },
                  ],
                  filterSearch: true,
                  onFilter: (value, record) => {
                    const text = record?.ngayDatHang;

                    const split = text?.split(":");
                    const time = split[1]?.split("-");
                    const hh = Number.parseInt(time[0]);

                    const base = value?.split("-");
                    const num = Number.parseInt(base[0]);
                    const check = base[1];

                    if (check === "start") {
                      if (timeEnd === 0) return hh >= num;
                      return hh >= num && hh <= timeEnd;
                    } else {
                      if (timeStart === 0) return hh >= num;
                      return hh <= num && hh >= timeStart;
                    }
                  },
                  sorter: (a, b) =>
                    a?.ngayDatHang.localeCompare(b?.ngayDatHang),
                  render: (_, { id, ngayDatHang, ngayGiaoHang }) => {
                    const split = ngayDatHang?.split(":");
                    const splitTime = split[1]?.split("-");

                    const dateOrder = new Date(
                      `${split[0]}:${splitTime[0]}:${splitTime[1]}`
                    );

                    const dateTranfer = new Date(ngayGiaoHang);

                    return (
                      <React.Fragment>
                        <b>{id}</b>
                        <div>{dateOrder.toLocaleString()}</div>
                        <div>{dateTranfer.toLocaleString()}</div>
                      </React.Fragment>
                    );
                  },
                },
                {
                  title: "Địa chỉ",
                  dataIndex: "diaChi",
                  render: (_, { diaChi }) => {
                    const textStyle = {
                      width: "10rem",
                      textAlign: "justify",
                      textAlignLast: "justify",
                    };

                    return (
                      <React.Fragment>
                        <div style={textStyle}>{diaChi}</div>
                      </React.Fragment>
                    );
                  },
                },
                {
                  title: "Thành tiền",
                  dataIndex: "thanhTien",
                  sorter: (a, b) => a?.thanhTien - b?.thanhTien,
                  render: (_, { thanhTien }) => {
                    const priceStyle = {
                      color: "darkred",
                    };

                    return (
                      <React.Fragment>
                        <div style={priceStyle}>{thousandDot(thanhTien)} đ</div>
                      </React.Fragment>
                    );
                  },
                },
                {
                  title: "Tình trạng",
                  dataIndex: "tinhTrang",
                  filters: [
                    {
                      text: "Đang giao",
                      value: "Đang giao",
                    },
                    {
                      text: "Hủy bỏ",
                      value: "Hủy bỏ",
                    },
                    {
                      text: "Giao trễ",
                      value: "Giao trễ",
                    },
                    {
                      text: "Thành công",
                      value: "Thành công",
                    },
                  ],
                  filterSearch: true,
                  onFilter: (value, record) => {
                    const text = record?.tinhTrang;
                    return text?.startsWith(value);
                  },
                },
                {
                  title: "Thao tác",
                  dataIndex: "thaoTac",
                  render: (_, { userId, stt, sanPham, tinhTrang }) => {
                    const items = [
                      {
                        key: 1,
                        label: "Hủy bỏ",
                      },
                      {
                        key: 2,
                        label: "Giao trễ",
                      },
                      {
                        key: 3,
                        label: "Thành công",
                      },
                    ];

                    return (
                      <React.Fragment>
                        <Dropdown
                          disabled={tinhTrang === "Hủy bỏ"}
                          menu={{
                            items,
                            onClick: (e) => {
                              onAltState({
                                id: userId,
                                stt,
                                state: items[Number.parseInt(e.key) - 1].label,
                                items: sanPham,
                              });
                            },
                          }}
                        >
                          <Button>Hành động</Button>
                        </Dropdown>
                      </React.Fragment>
                    );
                  },
                },
              ]}
              data={payments.map((item, index) => ({ ...item, key: index }))}
            />
          </React.Fragment>
        </Padding>
      </div>
    </React.Fragment>
  );
}

export default PaymentAdmin;
