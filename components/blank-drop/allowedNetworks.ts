import {
  Avalanche,
  Linea,
  Arbitrum,
  Polygon,
  // Mumbai,
} from "@thirdweb-dev/chains";
import { StaticImageData } from "next/image";

export const blankDropAllowedNetworks = [
  // Mumbai,
  Polygon,
  Avalanche,
  Linea,
  Arbitrum,
];

export const blankDropNetworkMapping: Record<
  BlankDropAllowedNetworksSlugs,
  { contractAddress: string; image: StaticImageData }
> = {
  // [Mumbai.slug]: {
  //   contractAddress: "0x2602E80ce4e70A4A17afDe1C34fFA8A4D3901F72",
  //   image: require("../../public/assets/paper-drop/paper_polygon.png"),
  // },
  [Polygon.slug]: {
    contractAddress: "0x0",
    image: require("../../public/assets/paper-drop/paper_polygon.png"),
  },
  [Avalanche.slug]: {
    contractAddress: "0x0",
    // TODO update
    image: require("../../public/assets/paper-drop/paper_polygon.png"),
  },
  [Linea.slug]: {
    contractAddress: "0x0",
    // TODO update
    image: require("../../public/assets/paper-drop/paper_polygon.png"),
  },
  [Arbitrum.slug]: {
    contractAddress: "0x0",
    image: require("../../public/assets/paper-drop/paper_arbitrum.png"),
  },
};

export const blankDropAllowedNetworksSlugs = blankDropAllowedNetworks.map(
  (network) => network.slug,
);

// type for slug of all allowed networks slugs
export type BlankDropAllowedNetworksSlugs =
  (typeof blankDropAllowedNetworksSlugs)[number];
