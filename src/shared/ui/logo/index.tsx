import React from "react";

interface Props {
  color?: string;
  size?: number | string;
}

export const Logo: React.FC<Props> = ({
  size = 18,
  color = "white",
}) => {
  const normalizedSize = typeof size === "number" ? `${size}px` : size;

  const viewMinX = 12.6944;
  const viewMinY = 15.6277;
  const viewWidth = 41.5381 - 12.6944;
  const viewHeight = 44.2765 - 15.6277;

  return (
    <svg
      width={normalizedSize}
      height={normalizedSize}
      viewBox={`${viewMinX} ${viewMinY} ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <path
        d={`M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644
                42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 
                19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 
                31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 
                19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 
                31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108
                20.739Z`}
        fill={color}
      />
    </svg>
  );
};
