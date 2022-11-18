import React from "react";

export function PageIndex(props) {
  const { length, limited, callback } = props;

  const range = 3;

  const indexStart = 1;
  const indexEnd = Math.ceil(length / limited);

  const [indexs, setIndexs] = React.useState(indexStart);

  const onClickedIndex = React.useCallback(
    (index) => {
      setIndexs(index);

      const check = index * limited > length;

      const x = (index - 1) * limited;
      const y = check ? length : index * limited;

      callback(x, y);
    },
    [callback, length, limited]
  );

  const Indexed = React.memo((props) => {
    const { bgColor = "lightskyblue", index, base, limited, callback } = props;

    const [hover, setHover] = React.useState(false);

    const square = "2.5rem";
    const active = index === base;

    const indexedStyle = {
      width: square,
      height: square,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "0.1rem solid black",
      position: "relative",
      backgroundColor: !active ? (!hover ? "white" : bgColor) : bgColor,
    };

    const indexerStyle = base !== limited && {
      marginRight: "0.5rem",
    };

    const hoverStyle = {
      width: square,
      height: square,
      position: "absolute",
      opacity: 0.25,
      backgroundColor: "black",
    };

    const hoverIn = () => setHover(true);
    const hoverOut = () => setHover(false);

    const hoverProps = !active && {
      onMouseEnter: hoverIn,
      onMouseLeave: hoverOut,
    };

    return (
      <React.Fragment>
        <div
          style={{ ...indexedStyle, ...indexerStyle }}
          {...hoverProps}
          onClick={() => callback(base)}
        >
          {!active && hover && <div style={hoverStyle}></div>}
          <div>{base}</div>
        </div>
      </React.Fragment>
    );
  });

  const NonIndex = React.memo(() => {
    const square = "2.5rem";

    const indexedStyle = {
      width: square,
      height: square,
      marginRight: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "0.1rem solid black",
      backgroundColor: "white",
    };

    return (
      <React.Fragment>
        <div style={indexedStyle}>
          <div>...</div>
        </div>
      </React.Fragment>
    );
  });

  const checkRange = (index) => {
    if (indexEnd - indexStart <= range + 1) return false;

    if (index === indexStart) return false;
    if (index === indexEnd) return false;

    if (indexs === indexStart) {
      if (indexStart + range === index) return true;
      if (indexStart + range > index) return false;
      return null;
    }

    if (indexs === indexEnd) {
      if (indexEnd - range === index) return true;
      if (indexEnd - range < index) return false;
      return null;
    }

    const prev = indexs - 1;
    const next = indexs + 1;

    if (index >= prev && index <= next) return false;
    if (index === prev - 1 || index === next + 1) return true;
    return null;
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        {Array.apply(null, { length: indexEnd })?.map((_, index) => {
          const base = index + 1;
          const bool = checkRange(base);

          if (bool === null) {
            return <React.Fragment key={index}></React.Fragment>;
          }

          return (
            <React.Fragment key={index}>
              {bool && (
                <React.Fragment>
                  <NonIndex />
                </React.Fragment>
              )}
              {!bool && (
                <React.Fragment>
                  <Indexed
                    index={indexs}
                    base={base}
                    limited={indexEnd}
                    callback={onClickedIndex}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </React.Fragment>
  );
}
