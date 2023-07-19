import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Heading, Link } from "tw-components";
import { blankDropAllowedNetworks } from "./allowedNetworks";

export const BlankDropSelectNetwork = () => {
  return (
    <Flex flexDir="column" gap={6}>
      <Heading size="display.sm" textAlign="center">
        Choose your network
      </Heading>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        {blankDropAllowedNetworks.map((network) => (
          <Link key={network.chainId} href={`/paper-drop/${network.slug}`}>
            {network.name}
          </Link>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
