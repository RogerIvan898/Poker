const USER_FRIENDLY_TON_ADDRESS = /^(EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46}$/;
const RAW_TON_ADDRESS = /^[0-9a-fA-F]{64}$/;

export const isTonAddress = (value: string) => {
  const trimmed = value.trim();

  return (
    USER_FRIENDLY_TON_ADDRESS.test(trimmed) || RAW_TON_ADDRESS.test(trimmed)
  );
};
