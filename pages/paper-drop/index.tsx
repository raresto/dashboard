import {
  AspectRatio,
  Container,
  Flex,
  Icon,
  IconButton,
  Img,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { Aurora } from "components/homepage/Aurora";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Button, Card, Heading, Text } from "tw-components";
import { IconLogo } from "components/logo";
import { FiArrowRightCircle, FiX } from "react-icons/fi";
import {
  blankDropAllowedNetworks,
  blankDropNetworkMapping,
} from "components/blank-drop/allowedNetworks";
import { useSingleQueryParam } from "hooks/useQueryParam";
import {
  ThirdwebProvider,
  paperWallet,
  useAddress,
  useContract,
  useDisconnect,
  useNFTBalance,
  usePaperWallet,
  useWallet,
} from "@thirdweb-dev/react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChakraNextImage } from "components/Image";
import { useRouter } from "next/router";
import { SanctionedAddressesChecker } from "components/safety/sanctioned-addresses";
import { RequireSignin } from "components/notices/PrivacyNotice";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "constants/rpc";
import { THIRDWEB_API_HOST, THIRDWEB_DOMAIN } from "constants/urls";
import { useClaimBlankDrop } from "@3rdweb-sdk/react/hooks/useClaimBlankDrop";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";

const title = "thirdweb x paper";
const description = "Claim this conmemorative NFT.";

const TRACKING_CATEGORY = "paper-drop";

const PAPER_OPTIONS = {
  paperClientId: "9a2f6238-c441-4bf4-895f-d13c2faf2ddb",
  advancedOptions: {
    recoveryShareManagement: "AWS_MANAGED",
  },
} as const;

const BlankDropPage: ThirdwebNextPage = () => {
  const urlNetwork = useSingleQueryParam("network");
  const router = useRouter();

  const [selectedNetwork, setSelectedNetwork] = useState("");

  // updated the selected network if the url changes
  useEffect(() => {
    if (!selectedNetwork && urlNetwork) {
      setSelectedNetwork(urlNetwork);
    }
  }, [selectedNetwork, urlNetwork]);

  // update the url if the selected network changes
  useEffect(() => {
    if (selectedNetwork && selectedNetwork !== urlNetwork) {
      router.replace(`?network=${selectedNetwork}`, undefined, {
        scroll: false,
        shallow: true,
      });
    }
  }, [selectedNetwork, router, urlNetwork]);

  const selectedChain = useMemo(
    () =>
      blankDropAllowedNetworks.find(
        (network) => network.slug === selectedNetwork,
      ),
    [selectedNetwork],
  );

  const trackEvent = useTrack();

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              // TODO: Replace this with the correct image
              url: `${getAbsoluteUrl()}/assets/og-image/bear-market-airdrop.png`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
      />

      <Aurora
        pos={{ top: "0%", left: "50%" }}
        size={{ width: "100%", height: "1400px" }}
        color="hsl(289deg 78% 30% / 35%)"
        zIndex={1}
      />
      <Container maxW="container.page">
        <Flex
          direction="column"
          justify="center"
          py={12}
          gap={{ base: 8, md: 12 }}
        >
          <SimpleGrid gap={4} columns={3} placeItems={"center"} mx="auto">
            <IconLogo boxSize={{ base: 24, md: 48 }} />

            <Icon
              zIndex={1}
              color="#fff"
              boxSize={{ base: 12, md: 24 }}
              as={FiX}
            />

            <Img
              boxSize={{ base: 24, md: 48 }}
              objectFit="contain"
              src="https://withpaper.com/icons/paper-logo-icon.svg"
            />
          </SimpleGrid>
          <Container maxW="container.md">
            <Flex direction="column" gap={6}>
              <Heading as="h1" textAlign="center" size="display.lg">
                Join us on the road to mass adoption.
              </Heading>
              <Text textAlign="center" size="body.2xl">
                To celebrate our acquisition of Paper, we invite you to mint a
                free commemorative NFT on the chain of your choice.
              </Text>
            </Flex>
          </Container>
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            gap={{ base: 6, md: 8 }}
            placeItems={"center"}
            mx="auto"
          >
            {blankDropAllowedNetworks.map((network) => (
              <Flex
                role="group"
                key={network.chainId}
                direction="column"
                gap={2}
                cursor="pointer"
                onClick={() => {
                  setSelectedNetwork(network.slug);
                  trackEvent({
                    category: TRACKING_CATEGORY,
                    action: "select-network",
                    label: network.slug,
                  });
                  // scroll to the drop content
                  setTimeout(() => {
                    document
                      .getElementById("#drop-content")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                <Card
                  p={{ base: 3, md: 4 }}
                  borderRadius="lg"
                  borderColor={
                    network.slug === selectedNetwork
                      ? "blue.500"
                      : "transparent"
                  }
                  _groupHover={{
                    borderColor:
                      network.slug === selectedNetwork
                        ? "blue.500"
                        : "blue.600",
                  }}
                >
                  <Img
                    pointerEvents="none"
                    src={network.icon.url.replace(
                      "ipfs://",
                      `https://gateway.ipfscdn.io/ipfs/`,
                    )}
                    filter={network.slug === "linea" ? "invert(1)" : "none"}
                    boxSize={{ base: 16, md: 16 }}
                  />
                </Card>

                <Heading
                  textAlign="center"
                  as="h3"
                  size="subtitle.sm"
                  textTransform="capitalize"
                  color={
                    network.slug === selectedNetwork ? "blue.500" : "gray.700"
                  }
                  _groupHover={{
                    color:
                      network.slug === selectedNetwork
                        ? "blue.500"
                        : "blue.600",
                  }}
                >
                  {network.slug}
                </Heading>
              </Flex>
            ))}
          </SimpleGrid>
          <ClientOnly ssr={null}>
            {selectedChain && (
              <ThirdwebProvider
                clientId={DASHBOARD_THIRDWEB_CLIENT_ID}
                supportedWallets={[paperWallet(PAPER_OPTIONS)]}
                activeChain={selectedChain}
                authConfig={{
                  domain: THIRDWEB_DOMAIN,
                  authUrl: `${THIRDWEB_API_HOST}/v1/auth`,
                }}
              >
                <ClaimDrop chain={selectedChain} />
              </ThirdwebProvider>
            )}
          </ClientOnly>
        </Flex>
      </Container>
    </>
  );
};
BlankDropPage.pageId = PageId.BlankDrop;

export default BlankDropPage;

const emailSchema = z.object({
  email: z.string().email(),
});

interface ClaimDropProps {
  chain: (typeof blankDropAllowedNetworks)[number];
}

const ClaimDrop: React.FC<ClaimDropProps> = ({ chain }) => {
  const wallet = useWallet();
  const disconnect = useDisconnect();
  const connect = usePaperWallet();
  const address = useAddress();

  const isPaperWalletConnected = address && wallet?.walletId === "paper";

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const trackEvent = useTrack();
  const claimDrop = useClaimBlankDrop();

  const networkData = blankDropNetworkMapping[chain.slug];

  const { contract } = useContract(networkData?.contractAddress);
  const { data: balance } = useNFTBalance(
    contract,
    isPaperWalletConnected ? address : "",
  );

  const hasMinted = BigNumber.from(balance || 0)?.toNumber() > 0;

  const { onSuccess, onError } = useTxNotifications(
    "Successfully claimed NFT",
    "Failed to claim NFT",
  );

  return (
    <>
      <RequireSignin product="thirdweb x paper drop" />
      <SanctionedAddressesChecker>
        <Flex direction="column" gap={4} mt={12}>
          <Container maxW="md" id="#drop-content">
            <Card p={0} overflow="hidden" bg="backgroundDark">
              <Flex gap={4} direction="column">
                <AspectRatio ratio={1} w="100%">
                  <ChakraNextImage
                    borderBottomRadius="md"
                    src={blankDropNetworkMapping[chain.slug].image}
                    alt={`thirdweb x paper x ${chain.slug}`}
                  />
                </AspectRatio>
                <Flex direction="column" gap={4} px={4} py={6}>
                  {hasMinted ? (
                    <Flex>successfully minted!</Flex>
                  ) : isPaperWalletConnected ? (
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => {
                        if (!address) {
                          // invalid state
                          return;
                        }
                        trackEvent({
                          category: TRACKING_CATEGORY,
                          action: "claim-nft",
                          label: "attempt",
                          network: chain.slug,
                        });

                        claimDrop.mutate(
                          {
                            network: chain.slug,
                            address: address || "",
                          },
                          {
                            onSuccess: () => {
                              onSuccess();
                              trackEvent({
                                category: TRACKING_CATEGORY,
                                action: "claim-nft",
                                label: "success",
                                network: chain.slug,
                              });
                            },
                            onError: (err) => {
                              onError(err);
                              trackEvent({
                                category: TRACKING_CATEGORY,
                                action: "claim-nft",
                                label: "error",
                                error: err,
                                network: chain.slug,
                              });
                            },
                          },
                        );
                      }}
                    >
                      Claim your nft
                    </Button>
                  ) : (
                    <form
                      onSubmit={form.handleSubmit(async (data) => {
                        // if we're already connected to some other wallet first disconnect
                        if (wallet) {
                          await disconnect();
                        }
                        trackEvent({
                          category: TRACKING_CATEGORY,
                          action: "connect-paper",
                          label: "attempt",
                        });
                        try {
                          await connect({
                            email: data.email,
                            chainId: chain.chainId,
                            ...PAPER_OPTIONS,
                          });
                          trackEvent({
                            category: TRACKING_CATEGORY,
                            action: "connect-paper",
                            label: "success",
                          });
                        } catch (err) {
                          trackEvent({
                            category: TRACKING_CATEGORY,
                            action: "connect-paper",
                            label: "error",
                            error: err,
                          });
                        }
                      })}
                    >
                      <Flex direction="column" gap={3}>
                        <Heading as="label" size="label.lg">
                          Enter your email to claim the drop
                        </Heading>
                        <Flex>
                          <Input
                            type="email"
                            placeholder="paper@thirdweb.com"
                            {...form.register("email")}
                          />
                          <IconButton
                            aria-label="submit"
                            variant="ghost"
                            isLoading={form.formState.isSubmitting}
                            icon={<Icon as={FiArrowRightCircle} />}
                          />
                        </Flex>
                      </Flex>
                    </form>
                  )}
                </Flex>
              </Flex>
            </Card>
          </Container>
          <Container maxW="md">
            <Text size="body.md">• Open Edition</Text>
            <Text size="body.md">• Free, gasless</Text>
            <Text size="body.md">• Open for the next 48 hours</Text>
            <Text size="body.md">• No roadmap, no utility</Text>
          </Container>
        </Flex>
      </SanctionedAddressesChecker>
    </>
  );
};

{
  /* <Flex
            gap={8}
            flexDir="column"
            justifyContent="center"
            h="full"
            mt={16}
          >
            <Heading
              bgGradient="linear(to-r, #743F9E, #BFA3DA)"
              bgClip="text"
              size="display.md"
              display="inline-block"

            >
              thirdweb x paper
            </Heading>
            <Text size="body.xl" textAlign="center">
              Join us on the road to mass adoption.
            </Text>
            <Text size="body.xl" textAlign="center">
              To celebrate our ***, we invite you to mint a free conmemorative
              NFT on the network of your choice.
            </Text>
            <Flex flexDir="column">
              <Text size="body.xl" textAlign="center">
                • Open Edition
              </Text>
              <Text size="body.xl" textAlign="center">
                • Free, gasless
              </Text>
              <Text size="body.xl" textAlign="center">
                • Open for the next 48 hours
              </Text>
              <Text size="body.xl" textAlign="center">
                • No roadmap, no utility
              </Text>
            </Flex> */
}
{
  /* <BlankDropSelectNetwork /> */
}
{
  /* </Flex> */
}
