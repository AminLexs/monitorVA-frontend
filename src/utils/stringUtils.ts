export const getShortContainersID = (id: string) => {
  return id.slice(0, 12);
};

export const getDateFromString = (date: string) => {
  return new Date(date).toLocaleString()
}