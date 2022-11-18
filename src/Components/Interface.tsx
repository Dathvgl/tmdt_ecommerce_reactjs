import React from "react";

type NumChar = number | string;

interface BasicProps {
  children?: React.ReactNode;
}

interface DivProps extends BasicProps, React.HTMLAttributes<HTMLDivElement> {}

interface AnchorProps
  extends BasicProps,
    HoverProps,
    React.HTMLAttributes<HTMLAnchorElement> {
  link?: string;
  onClick?: React.MouseEventHandler;
}

interface ButtonProps
  extends BasicProps,
    HoverProps,
    React.HtmlHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit" | "reset" | undefined;
}

interface HoverProps {
  hoverText?: string;
  hoverBack?: string;
}

interface TextProps {
  textSize?: number;
  textColor?: string;
  textWeight?: string;
  textDecoration?: string;
}

interface BackProps {
  backgroundColor?: string;
}

interface SizeProps {
  width?: NumChar;
  height?: NumChar;
}

interface BorderProps {
  borderWidth?: number;
  borderRadius?: number;
  borderStyle?: string;
  borderColor?: string;
}

export type {
  NumChar,
  DivProps,
  AnchorProps,
  ButtonProps,
  HoverProps,
  TextProps,
  BackProps,
  SizeProps,
  BorderProps,
};
