import React from "react";
import { Image } from "react-bootstrap";
import Scrollbars from "react-custom-scrollbars-2";
import { Padding, SizedBox } from "../Components/Layout";
import { ProductLabel, ProductObj } from "../Model/Product.model";

function DetailItem(props) {
  const callback = props?.callback;

  const display = props?.display;

  const [product, setProduct] = React.useState(structuredClone(ProductObj));

  const popUpStyle = {
    display: !display ? "none" : "block",
    position: "fixed",
    top: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 2,
  };

  const addStyle = {
    display: !display ? "none" : "block",
    position: "fixed",
    top: "10%",
    left: "25%",
    width: "50vw",
    height: "80vh",
    backgroundColor: "white",
    zIndex: 3,
  };

  React.useEffect(() => {
    if (props?.item === undefined) return;
    if (product?.coBan.ten !== ProductObj.coBan.ten) return;

    const objLast = structuredClone(ProductObj);
    Object.keys(product)?.forEach((item) => {
      Object.keys(product[item])?.forEach((child) => {
        if (item !== "doHoa") {
          if (Array.isArray(props?.item[item][child]))
            objLast[item][child] = structuredClone(props?.item[item][child]);
          else objLast[item][child] = props?.item[item][child];
          return;
        }

        Object.keys(product[item][child])?.forEach((dark) => {
          objLast[item][child][dark] = props?.item[item][child][dark];
        });
      });
    });
    setProduct(objLast);
  }, [product, props?.item]);

  return (
    <React.Fragment>
      <div style={popUpStyle} onClick={() => callback()} />
      <div style={addStyle}>
        <Scrollbars style={{ width: "100%", height: "100%" }}>
          <h3 style={{ margin: 0 }}>{product?.coBan?.ten}</h3>
          <Image src={product?.coBan?.hinhAnh[0]} />
          <Padding horizontal="2rem" top="2rem">
            {Object.keys(product)?.map((item, index) => (
              <React.Fragment key={index}>
                {item !== "doHoa" && item !== "coBan" && (
                  <React.Fragment>
                    <h4>{ProductLabel[index]?.base}</h4>
                    {Object.keys(product[item])?.map((child, count) => (
                      <React.Fragment key={count}>
                        {product[item][child] !== "" && (
                          <div>
                            <b>{ProductLabel[index]?.child[count]}:</b>{" "}
                            {product[item][child]}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                    <SizedBox width="100%" height="2rem" />
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </Padding>
        </Scrollbars>
      </div>
    </React.Fragment>
  );
}

export default DetailItem;
