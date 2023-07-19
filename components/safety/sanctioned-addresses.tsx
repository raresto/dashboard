import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { isSanctionedAddress } from "data/eth-sanctioned-addresses";
import { useMemo } from "react";
import { Heading } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export const SanctionedAddressesChecker: ComponentWithChildren = ({
  children,
}) => {
  const address = useAddress();
  const isBlocked = useMemo(() => {
    return address && isSanctionedAddress(address);
  }, [address]);
  if (isBlocked) {
    return (
      <SimpleGrid
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        left={0}
        placeItems="center"
        bg="black"
        zIndex="banner"
      >
        <Flex gap={4} direction="column" align="center">
          <Heading as="p">Address is blocked</Heading>
          <ConnectWallet auth={{ loginOptional: true }} />
        </Flex>
      </SimpleGrid>
    );
  }
  return <>{children}</>;
};
