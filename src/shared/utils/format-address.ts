export const formatAddress = (address: string, edge = 4) =>
  `${address.slice(0, edge)}...${address.slice(-edge)}`;
