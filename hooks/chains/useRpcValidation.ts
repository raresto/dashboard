import { useQuery } from "@tanstack/react-query";
import { getChainByChainId } from "@thirdweb-dev/chains";
import { constants } from "ethers";
import { useState } from "react";
import { ZodError, z } from "zod";

const rpcUrlSchema = z.string().url();

interface IExistingChain {
  id: number;
  mainnet: boolean;
  name: string;
  infoURL?: string | undefined;
}

export function useRpcValidation(rpcUrl: string) {
  const [existingChain, setExistingChain] = useState<
    IExistingChain | null | undefined
  >(undefined);

  const validUrlQuery = useQuery<string, ZodError>({
    queryKey: ["validate-rpc-url", { rpcUrl }],
    queryFn: async () => {
      return rpcUrlSchema.parseAsync(rpcUrl);
    },
    enabled: false,
    retry: false,
  });

  const supportsChainId = useQuery<boolean, Error>({
    queryKey: ["validate-rpc-chain-id", { rpcUrl }],
    queryFn: async () => {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_chainId",
          params: [],
          id: 1,
        }),
      });

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      try {
        const rpcChainId = parseInt(json.result, 16);
        const r = getChainByChainId(rpcChainId);
        setExistingChain({
          id: r.chainId,
          name: r.name,
          mainnet: !r.testnet,
          infoURL: "infoURL" in r ? r.infoURL : undefined,
        });
      } catch (err) {
        setExistingChain(null);
      }

      return true;
    },
    enabled: false,
    retry: false,
  });

  const supportsBlockNumber = useQuery<boolean, Error>({
    queryKey: ["validate-rpc-block-number", { rpcUrl }],
    queryFn: async () => {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return true;
    },
    enabled: false,
    retry: false,
  });

  const supportsGetBalance = useQuery<boolean, Error>({
    queryKey: ["validate-rpc-get-balance", { rpcUrl }],
    queryFn: async () => {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [constants.AddressZero],
          id: 1,
        }),
      });

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error.message);
      }

      return true;
    },
    enabled: false,
    retry: false,
  });

  const validationReport = {
    urlValid: validUrlQuery.isSuccess,
    urlLoading: validUrlQuery.isFetching,
    urlError: validUrlQuery.error,
    chainIdSupported: supportsChainId.isSuccess,
    chainIdLoading: supportsChainId.isFetching,
    chainIdError: supportsChainId.error,
    blockNumberSupported: supportsBlockNumber.isSuccess,
    blockNumberLoading: supportsBlockNumber.isFetching,
    blockNumberError: supportsBlockNumber.error,
    getBalanceSupported: supportsGetBalance.isSuccess,
    getBalanceLoading: supportsGetBalance.isFetching,
    getBalanceError: supportsGetBalance.error,
    existingChain,
    allValid:
      validUrlQuery.isSuccess &&
      supportsChainId.isSuccess &&
      supportsBlockNumber.isSuccess &&
      supportsGetBalance.isSuccess,
  } as const;

  return [
    validationReport,
    () => {
      validUrlQuery.refetch();
      supportsChainId.refetch();
      supportsBlockNumber.refetch();
      supportsGetBalance.refetch();
    },
  ] as const;
}
