export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate().toLocaleString().padStart(2, '0');
  const month = (date.getMonth() + 1).toLocaleString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toLocaleString().padStart(2, '0');
  const minutes = date.getMinutes().toLocaleString().padStart(2, '0');
  const seconds = date.getSeconds().toLocaleString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
