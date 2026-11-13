export function formatDate(date: string) {
  if (date === '') {
    return false;
  }
  const [year, month, day] = date.split('-');
  return `${year}年${month}月${day}日`;
};