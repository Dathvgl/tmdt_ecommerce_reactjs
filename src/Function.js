export const thousandDot = (x) => {
  return Number(x)?.toLocaleString()?.replace(",", ".");
};
