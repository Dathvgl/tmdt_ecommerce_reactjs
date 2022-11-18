import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardAdmin() {
  const node = process.env?.REACT_APP_NODE;

  const dataset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const [payments, setPayments] = React.useState([]);
  const [data1, setData1] = React.useState(structuredClone(dataset));
  const [data2, setData2] = React.useState(structuredClone(dataset));
  const [data3, setData3] = React.useState(structuredClone(dataset));
  const [data4, setData4] = React.useState(structuredClone(dataset));

  const filterData = React.useCallback(() => {
    const datasetBase = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const dataset1 = structuredClone(datasetBase);
    const dataset2 = structuredClone(datasetBase);
    const dataset3 = structuredClone(datasetBase);
    const dataset4 = structuredClone(datasetBase);

    const array = payments?.filter((item) => {
      const today = new Date();
      const yyyy = today.getFullYear().toString();

      const current = item?.ngayDatHang?.split(":");
      const date = current[0]?.split("-");
      return date[0] === yyyy;
    });

    array?.forEach((item) => {
      const { tinhTrang, thanhTien } = item;
      const mm = Number.parseInt(item?.ngayDatHang?.split("-")[1]) - 1;

      switch (tinhTrang) {
        case "Đang giao":
          dataset1[mm] += thanhTien;
          break;
        case "Hủy bỏ":
          dataset2[mm] += thanhTien;
          break;
        case "Giao trễ":
          dataset3[mm] += thanhTien;
          break;
        case "Thành công":
          dataset4[mm] += thanhTien;
          break;
        default:
          break;
      }
    });

    setData1(dataset1);
    setData2(dataset2);
    setData3(dataset3);
    setData4(dataset4);
  }, [payments]);

  React.useEffect(() => {
    async function getPayments() {
      const res = await axios.get(`${node}/payment`);
      const { data } = res;

      const array = [];
      data
        ?.map(({ soLuong, chiTiet }) => ({ soLuong, chiTiet }))
        ?.filter((item) => item?.soLuong !== 0)
        ?.forEach(({ chiTiet }) => {
          array.push(
            ...Object.keys(chiTiet)?.map((key) => ({
              ngayDatHang: chiTiet[key]?.ngayDatHang,
              ngayGiaoHang: chiTiet[key]?.ngayGiaoHang,
              tinhTrang: chiTiet[key]?.tinhTrang,
              thanhTien: chiTiet[key]?.thanhTien,
            }))
          );
        });

      setPayments(array);
    }

    getPayments();
  }, [node]);

  React.useEffect(() => {
    filterData();
  }, [filterData]);

  return (
    <React.Fragment>
      <Bar
        data={{
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          datasets: [
            {
              label: "Đang giao",
              backgroundColor: "#3e95cd",
              data: data1,
            },
            {
              label: "Hủy bỏ",
              backgroundColor: "#c45850",
              data: data2,
            },
            {
              label: "Giao trễ",
              backgroundColor: "#8e5ea2",
              data: data3,
            },
            {
              label: "Thành công",
              backgroundColor: "#3cba9f",
              data: data4,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Biểu đồ đơn hàng trong năm",
            },
          },
        }}
      />
    </React.Fragment>
  );
}

export default DashboardAdmin;
