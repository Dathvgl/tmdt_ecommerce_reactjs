import axios from "axios";
import React from "react";
import { Padding } from "../Components/Layout";
import { TableRes } from "../ComponentsTSX";

function UserAdmin() {
  const node = process.env?.REACT_APP_NODE;

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    async function getUsers() {
      const res = await axios.get(`${node}/user`);
      const { data } = res;

      setUsers(Object.keys(data).map((item) => ({ ...data[item] })));
    }

    getUsers();
  }, [node]);

  const itemStyle = {
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  return (
    <React.Fragment>
      <div style={itemStyle}>
        <Padding all={1}>
          <TableRes
            columns={[
              {
                title: "Họ và tên",
                dataIndex: "hoTen",
                sorter: (a, b) => a?.hoTen.localeCompare(b?.hoTen),
              },
              {
                title: "Giới tính",
                dataIndex: "gioiTinh",
                filters: [
                  {
                    text: "Nam",
                    value: "Nam",
                  },
                  {
                    text: "Nữ",
                    value: "Nữ",
                  },
                ],
                filterSearch: true,
                onFilter: (value, record) => {
                  const text = record?.gioiTinh;
                  return text?.startsWith(value);
                },
              },
              {
                title: "Số điện thoại",
                dataIndex: "soDienThoai",
              },
              {
                title: "Vai trò",
                dataIndex: "vaiTro",
                filters: [
                  {
                    text: "Admin",
                    value: "admin",
                  },
                  {
                    text: "Client",
                    value: "client",
                  },
                ],
                filterSearch: true,
                onFilter: (value, record) => {
                  const text = record?.vaiTro;
                  return text?.startsWith(value);
                },
              },
            ]}
            data={users.map((item, index) => ({ ...item, key: index }))}
          />
        </Padding>
      </div>
    </React.Fragment>
  );
}

export default UserAdmin;
