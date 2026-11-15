import { isNumber } from "./isNumber";

export function formatNumber(value: number) {
    return isNumber(value) ? value.toLocaleString() : '－';
  }