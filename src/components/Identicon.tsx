import * as React from "react";

const Identicon = () => {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect
        x={0.5}
        y={0.5}
        width={35}
        height={35}
        rx={17.5}
        fill="url(#pattern0)"
        stroke="#D9D9D9"
      />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <use xlinkHref="#image0_6490_86846" transform="translate(0 -.012) scale(.00595)" />
        </pattern>
        <image
          id="image0_6490_86846"
          width={168}
          height={172}
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default Identicon;