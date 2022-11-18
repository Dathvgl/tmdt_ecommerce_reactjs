import React from "react";
import {
  BackProps,
  DivProps,
  NumChar,
  SizeProps,
  TextProps,
} from "./Interface";

//#region Row-Column
export class AxisSize {
  static readonly min: boolean = false;
  static readonly max: boolean = true;
}

export class AxisAlign {
  static readonly start: string = "flex-start";
  static readonly end: string = "flex-end";
  static readonly center: string = "center";
  static readonly spaceBetween: string = "space-between";
  static readonly spaceAround: string = "space-around";
  static readonly spaceEvenly: string = "space-evenly";
}

interface AlignProps extends DivProps {
  mainAxisSize: boolean;
  mainAxisAlign: string;
  crossAxisAlign: string;
}

interface ColumnProps {
  isRoot: boolean;
}

export const Row: React.FC<AlignProps> = (props: AlignProps) => {
  const style: React.CSSProperties = {
    display: "flex",
    width: !props.mainAxisSize ? "fit-content" : "100%",
    justifyContent: props.mainAxisAlign,
    alignItems: props.crossAxisAlign,
  };

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

Row.defaultProps = {
  mainAxisSize: AxisSize.max,
  mainAxisAlign: AxisAlign.center,
  crossAxisAlign: AxisAlign.center,
};

export const Column: React.FC<AlignProps & ColumnProps> = (
  props: AlignProps & ColumnProps
) => {
  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "100%",
    width: "100%",
    height: !props.mainAxisSize
      ? "fit-content"
      : !props.isRoot
      ? "100%"
      : "100vh",
    justifyContent: props.mainAxisAlign,
    justifyItems: props.mainAxisAlign,
    alignContent: props.crossAxisAlign,
  };

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

Column.defaultProps = {
  isRoot: false,
  mainAxisSize: AxisSize.max,
  mainAxisAlign: AxisAlign.center,
  crossAxisAlign: AxisAlign.center,
};
//#endregion

//#region SizedBox
interface SizedBoxProps extends DivProps, SizeProps {}

export const SizedBox: React.FC<SizedBoxProps> = (props: SizedBoxProps) => {
  const style: React.CSSProperties = {
    width: isNaN(Number(props.width)) ? props.width : `${props.width}rem`,
    height: isNaN(Number(props.height)) ? props.height : `${props.height}rem`,
  };

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

SizedBox.defaultProps = { width: 0, height: 0 };
//#endregion

//#region Padding
interface PaddingProps extends DivProps {
  all?: NumChar;

  horizontal?: NumChar;
  vertical?: NumChar;

  left?: NumChar;
  right?: NumChar;
  top?: NumChar;
  bottom?: NumChar;
}

export const Padding: React.FC<PaddingProps> = (props: PaddingProps) => {
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  if (props.left !== undefined) {
    style.paddingLeft = isNaN(Number(props.left))
      ? props.left
      : `${props.left}rem`;
  }

  if (props.right !== undefined) {
    style.paddingRight = isNaN(Number(props.right))
      ? props.right
      : `${props.right}rem`;
  }

  if (props.top !== undefined) {
    style.paddingTop = isNaN(Number(props.top)) ? props.top : `${props.top}rem`;
  }

  if (props.bottom !== undefined) {
    style.paddingBottom = isNaN(Number(props.bottom))
      ? props.bottom
      : `${props.bottom}rem`;
  }

  if (props.horizontal !== undefined) {
    style.paddingLeft = isNaN(Number(props.horizontal))
      ? props.horizontal
      : `${props.horizontal}rem`;
    style.paddingRight = isNaN(Number(props.horizontal))
      ? props.horizontal
      : `${props.horizontal}rem`;
  }

  if (props.vertical !== undefined) {
    style.paddingTop = isNaN(Number(props.vertical))
      ? props.vertical
      : `${props.vertical}rem`;
    style.paddingBottom = isNaN(Number(props.vertical))
      ? props.vertical
      : `${props.vertical}rem`;
  }

  if (props.all !== undefined) {
    style.padding = isNaN(Number(props.all)) ? props.all : `${props.all}rem`;
  }

  return (
    <div
      style={{ ...style, ...props.style }}
      className={props.className}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

Padding.defaultProps = {};
//#endregion

//#region SideBar
interface SideBarProps extends DivProps, TextProps, BackProps, SizeProps {}

interface SideBarVerticalProps extends SideBarProps {
  align: boolean;
}
export const SideBarHorizontal: React.FC<SideBarProps> = ({
  children,
  width,
  textColor,
  backgroundColor,
}) => {
  const style: React.CSSProperties = {
    width: "100%",
    display: "flex",
    color: "white",
    backgroundColor: "black",
  };

  if (width !== undefined) {
    style.width = `${width}%`;
  }

  if (textColor !== undefined) {
    style.color = textColor;
  }

  if (backgroundColor !== undefined) {
    style.backgroundColor = backgroundColor;
  }

  return <div style={style}>{children}</div>;
};

export const SideBarVertical: React.FC<SideBarVerticalProps> = ({
  children,
  width,
  textColor,
  backgroundColor,
  align = false,
}) => {
  const style: React.CSSProperties = {
    position: "fixed",
    top: "0",
    width: "20%",
    height: "100%",
    display: "flex",
    color: "white",
    backgroundColor: "black",
  };

  if (width !== undefined) {
    style.width = `${width}%`;
  }

  if (textColor !== undefined) {
    style.color = textColor;
  }

  if (backgroundColor !== undefined) {
    style.backgroundColor = backgroundColor;
  }

  !align ? (style.left = "0") : (style.right = "0");

  return <div style={style}>{children}</div>;
};
//#endregion
