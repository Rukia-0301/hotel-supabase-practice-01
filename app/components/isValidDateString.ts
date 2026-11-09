export function isValidDateString(value: string): boolean {
  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  // !Number.isNaN = 非数(Not a Number)ではない なおかつ toISOString = 2024-01-02T10:37:56.324Zのような形式に変換し、0から10文字目までを切り出したものがvalueと一致するか真偽値を返す
}