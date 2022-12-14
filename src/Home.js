import { Button, Input } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CategoryAdmin from "./Admin/Category";
import DashboardAdmin from "./Admin/Dashboard";
import HomeAdmin from "./Admin/HomeAdmin";
import PaymentAdmin from "./Admin/Payment";
import ProductAdmin from "./Admin/Product";
import UserAdmin from "./Admin/User";
import CartClient from "./Client/Cart";
import DashboardClient from "./Client/Dashboard";
import DetailOrder from "./Client/DetailOrder";
import HomeClient from "./Client/HomeClient";
import ListItemClient from "./Client/ListItem";
import ProfileClient from "./Client/Profile";
import SpecificItemClient from "./Client/SpecificItem";
import { Column, Padding, SizedBox } from "./Components/Layout";
import { Center, FloatLabel } from "./Components/Widget";
import { auth } from "./Firebase/config";
import { setExtensions } from "./React/Actions/Firebase/Actions";
import {
  setUser,
  signinInitiate,
  signupInitiate,
} from "./React/Actions/User/Actions";

function Home() {
  const node = process.env?.REACT_APP_NODE;

  const dispatch = useDispatch();
  const { extensions } = useSelector((state) => state?.fireBase);

  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    async function getCategories() {
      const res = await axios.get(`${node}/category`);
      const { data } = res;
      setCategories(
        Object.keys(data).map((item) => ({ ...data[item], id: item }))
      );
    }

    async function getProducts() {
      const res = await axios.get(`${node}/product`);
      const { data } = res;
      setProducts(
        Object.keys(data)
          .map((item) => ({ ...data[item], id: item }))
          .filter(
            ({ coBan: { soLuong, tinhTrang } }) =>
              soLuong > 0 && tinhTrang === "on"
          )
      );
    }

    const lengthFS = categories.length;
    const lengthRT = products.length;
    if (lengthFS === 0) getCategories();
    if (lengthRT === 0) getProducts();
  }, [categories, node, products]);

  React.useEffect(() => {
    const { fireStore, realTime } = extensions;
    const lengthFS = Object.keys(fireStore).length;
    const lengthRT = Object.keys(realTime).length;

    if (categories.length === 0 || products.length === 0) return;
    if (lengthFS !== 0 || lengthRT !== 0) return;

    dispatch(
      setExtensions({
        extensions: {
          ...extensions,
          fireStore: { ...fireStore, categories: categories },
          realTime: { ...realTime, products: products },
        },
      })
    );
  }, [categories, dispatch, extensions, products]);

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<HomeClient />}>
          <Route path="" element={<DashboardClient />} />
          <Route path="SanPham">
            <Route path="DanhSach" element={<ListItemClient />} />
            <Route path="ChiTiet/:id" element={<SpecificItemClient />} />
          </Route>
          <Route path="GioHang" element={<CartClient />} />
          <Route path="UserProfile" element={<ProfileClient />} />
          <Route path="DetailOrder/:id" element={<DetailOrder />} />
        </Route>
        <Route path="Login">
          <Route path="SignIn" element={<SignIn />} />
          <Route path="SignUp" element={<SignUp />} />
        </Route>
        <Route path="Admin" element={<HomeAdmin />}>
          <Route path="Dashboard" element={<DashboardAdmin />} />
          <Route path="Category" element={<CategoryAdmin />} />
          <Route path="Product" element={<ProductAdmin />} />
          <Route path="User" element={<UserAdmin />} />
          <Route path="Payment" element={<PaymentAdmin />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default Home;

function SignIn() {
  const itemStyle = {
    width: "20rem",
    height: "20rem",
    border: "0.1rem solid black",
    borderRadius: "2rem",
    backgroundColor: "white",
  };

  return (
    <React.Fragment>
      <Center isRoot>
        <div style={itemStyle}>
          <Padding all={1.5}>
            <SignInBase />
          </Padding>
        </div>
      </Center>
    </React.Fragment>
  );
}

function SignInBase() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state?.user);

  const [form, setForm] = React.useState({
    email: "",
    pass: "",
  });

  React.useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const onSubmit = React.useCallback(async () => {
    const { email, pass } = form;
    if (email === "" && pass === "") {
      notify("Email v?? m???t kh???u tr???ng");
      return;
    }

    if (email === "") {
      notify("Email ch??a nh???p");
      return;
    }

    if (pass === "") {
      notify("M???t kh???u ch??a nh???p");
      return;
    }

    dispatch(signinInitiate(email, pass, notify));
  }, [dispatch, form]);

  React.useEffect(() => {
    const listener = (e) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        onSubmit();
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [onSubmit]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm((obj) => ({ ...obj, [name]: value }));
  };

  const inputStyle = { marginBottom: "1rem" };

  const inputInStyle = { fontSize: "1.2rem" };

  const notify = (message) => toast(message);

  return (
    <React.Fragment>
      <Column>
        <h1 style={{ marginBottom: "1rem" }}>????ng nh???p</h1>
        <FloatLabel style={inputStyle} value={form.email} label="Email">
          <Input
            style={inputInStyle}
            value={form.email}
            onChange={onChangeInput}
            name="email"
            autoComplete="off"
          />
        </FloatLabel>
        <FloatLabel style={inputStyle} value={form.pass} label="Password">
          <Input
            style={inputInStyle}
            value={form.pass}
            onChange={onChangeInput}
            name="pass"
            type="password"
          />
        </FloatLabel>
        <a
          href={"/#"}
          onClick={(e) => {
            e.preventDefault();
            navigate("/Login/SignUp", { replace: true });
          }}
        >
          Ch??a c?? t??i kho???n?
        </a>
        <SizedBox height={1} />
        <Button type="primary" onClick={onSubmit}>
          ????ng nh???p
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
      </Column>
    </React.Fragment>
  );
}

function SignUp() {
  const itemStyle = {
    width: "20rem",
    height: "25rem",
    border: "0.1rem solid black",
    borderRadius: "2rem",
    backgroundColor: "white",
  };

  return (
    <React.Fragment>
      <Center isRoot>
        <div style={itemStyle}>
          <Padding all={1.5}>
            <SignUpBase />
          </Padding>
        </div>
      </Center>
    </React.Fragment>
  );
}

function SignUpBase() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state?.user);

  const [form, setForm] = React.useState({
    email: "",
    pass: "",
    passConfirm: "",
  });

  React.useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const onSubmit = React.useCallback(() => {
    const { email, pass, passConfirm } = form;
    if (email === "") {
      notify("Email ch??a nh???p");
      return;
    }

    if (pass.length < 6) {
      notify("M???t kh???u ??t h??n 6 k?? t???");
      return;
    }

    if (pass === "" || passConfirm === "") {
      notify("M???t kh???u ch??a nh???p");
      return;
    }

    if (pass !== passConfirm) {
      notify("M???t kh???u kh??ng kh???p");
      return;
    }

    dispatch(signupInitiate(email, pass));
    navigate("/");
  }, [dispatch, form, navigate]);

  React.useEffect(() => {
    const listener = (e) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        onSubmit();
      }
    };

    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [onSubmit]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm((obj) => ({ ...obj, [name]: value }));
  };

  const notify = (message) => toast(message);

  const inputStyle = { marginBottom: "1rem" };

  const inputInStyle = { fontSize: "1.2rem" };

  return (
    <React.Fragment>
      <Column>
        <h1 style={{ marginBottom: "1rem" }}>????ng k??</h1>
        <FloatLabel style={inputStyle} value={form.email} label="Email">
          <Input
            style={inputInStyle}
            value={form.email}
            onChange={onChangeInput}
            name="email"
            autoComplete="off"
          />
        </FloatLabel>
        <FloatLabel style={inputStyle} value={form.pass} label="Password">
          <Input
            style={inputInStyle}
            value={form.pass}
            onChange={onChangeInput}
            name="pass"
            type="password"
          />
        </FloatLabel>
        <FloatLabel
          style={inputStyle}
          value={form.passConfirm}
          label="Password Confirm"
        >
          <Input
            style={inputInStyle}
            value={form.passConfirm}
            onChange={onChangeInput}
            name="passConfirm"
            type="password"
          />
        </FloatLabel>
        <a
          href={"/#"}
          onClick={(e) => {
            e.preventDefault();
            navigate("/Login/SignIn", { replace: true });
          }}
        >
          ???? c?? t??i kho???n?
        </a>
        <SizedBox height={1} />
        <Button type="primary" onClick={onSubmit}>
          ????ng k??
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
      </Column>
    </React.Fragment>
  );
}
