import { Box, ButtonGroup, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Heading, Card, Button } from "tw-components";
import { KmsGcpConfig } from "./kms-gcp-config";
import { KmsAwsConfig } from "./kms-aws-config";

interface EngineKmsProps {
  instance: string;
}

export const EngineKmsConfig: React.FC<EngineKmsProps> = ({ instance }) => {
  const [selected, setSelected] = useState<"aws-kms" | "gcp-kms">("aws-kms");

  return (
    <Flex flexDir="column" gap={4}>
      <Heading size="title.md">Key Management Services</Heading>
      <Card>
        <Flex flexDir="column" gap={{ base: 0, md: 4 }} mb={6}>
          <Box
            w="full"
            overflow={{ base: "auto", md: "hidden" }}
            pb={{ base: 4, md: 0 }}
          >
            <ButtonGroup size="sm" variant="ghost" spacing={2}>
              <Button
                type="button"
                isActive={selected === "aws-kms"}
                _active={{
                  bg: "bgBlack",
                  color: "bgWhite",
                }}
                rounded="lg"
                onClick={() => setSelected("aws-kms")}
              >
                AWS KMS
              </Button>
              <Button
                type="button"
                isActive={selected === "gcp-kms"}
                _active={{
                  bg: "bgBlack",
                  color: "bgWhite",
                }}
                rounded="lg"
                onClick={() => setSelected("gcp-kms")}
              >
                Google KMS
              </Button>
            </ButtonGroup>
          </Box>
        </Flex>
        {selected === "aws-kms" && <KmsAwsConfig instance={instance} />}
        {selected === "gcp-kms" && <KmsGcpConfig instance={instance} />}
      </Card>
    </Flex>
  );
};