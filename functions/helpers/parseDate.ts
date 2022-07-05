interface Props {
  date: string;
}

export const parseDate = ({ date }: Props): string => {
  const dateObj = new Date(date);

  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  return `${month}/${day}/${year} - ${hours}:${minutes}`;
};
