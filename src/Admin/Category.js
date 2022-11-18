import { Button, Drawer, Space } from "antd";
import axios from "axios";
import React from "react";
import { Form, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AxisAlign, Column, Padding, Row } from "../Components/Layout";

function CategoryAdmin() {
  const { categories } = useSelector(
    (state) => state.fireBase?.extensions?.fireStore
  );

  const [selected, setSelected] = React.useState("all");

  const itemStyle = {
    border: "0.1rem black solid",
    borderRadius: "0.5rem",
    backgroundColor: "white",
  };

  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSelectSearch = (e) => {
    const value = e.target.value;
    setSelected(value);
  };

  return (
    <React.Fragment>
      <div style={{ ...itemStyle, ...{ marginBottom: "2rem" } }}>
        <Padding all={2}>
          <Row mainAxisAlign={AxisAlign.spaceBetween}>
            <Form style={{ width: "50%" }}>
              <Form.Select onChange={onSelectSearch}>
                <option value="all">Tất cả</option>
                {categories.map((item, index) => (
                  <React.Fragment key={index}>
                    <option value={index}>{item.name}</option>
                  </React.Fragment>
                ))}
              </Form.Select>
            </Form>
            <Button onClick={showDrawer}>Thêm danh mục</Button>
            <Drawer
              title="Thêm danh mục con"
              placement="right"
              onClose={onClose}
              open={open}
              headerStyle={{ backgroundColor: "lightgrey" }}
            >
              <AddCategory />
            </Drawer>
          </Row>
        </Padding>
      </div>
      <div style={itemStyle}>
        <Padding all={1}>
          {selected === "all" ? (
            <React.Fragment>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Tên danh mục</th>
                    <th>Nhãn</th>
                    <th>Số lượng danh mục con</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{item?.name}</td>
                        <td>{item?.label}</td>
                        <td>{item.list?.length}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Thứ tự</th>
                    <th>Tên danh mục</th>
                    <th>Mục con</th>
                  </tr>
                </thead>
                <tbody>
                  {categories[selected].list?.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{categories[selected]?.name}</td>
                        <td>{item}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </React.Fragment>
          )}
        </Padding>
      </div>
    </React.Fragment>
  );
}

function AddCategory() {
  const node = process.env?.REACT_APP_NODE;

  const { categories } = useSelector(
    (state) => state.fireBase?.extensions?.fireStore
  );

  const [form, setForm] = React.useState({
    id: -1,
    name: "",
  });

  const postCategory = React.useCallback(async () => {
    if (form.id === -1 || form.name === "") return;
    const { list } = categories?.find((item) => item.id === form.id);
    list.push(form.name);
    await axios.put(`${node}/category/${form.id}`, { item: list });
  }, [categories, form, node]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm((obj) => ({ ...obj, [name]: value }));
  };

  return (
    <React.Fragment>
      <Padding horizontal="2rem" top="2rem">
        <Column crossAxisAlign={AxisAlign.spaceBetween}>
          <Space size="middle" direction="vertical">
            <b>Chọn danh mục</b>
            <Form.Select name="id" onChange={onChangeInput}>
              {categories?.map((item, index) => (
                <React.Fragment key={index}>
                  <option value={item.id} key={index}>
                    {item.name}
                  </option>
                </React.Fragment>
              ))}
            </Form.Select>
            <b>Tên danh mục con</b>
            <Form.Control
              name="name"
              placeholder="Danh mục con"
              autoComplete="off"
              onChange={onChangeInput}
            />
          </Space>
          <Button onClick={postCategory} type="primary">
            Thêm danh mục
          </Button>
        </Column>
      </Padding>
    </React.Fragment>
  );
}

export default CategoryAdmin;
