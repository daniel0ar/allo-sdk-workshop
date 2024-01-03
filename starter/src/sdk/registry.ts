import { RegistryABI } from "@/abi/Registry";
import { client, account } from "@/services/viem";
import { wagmiConfigData } from "@/services/wagmi";
import { getEventValues } from "@/utils/common";
import { Registry } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { CreateProfileArgs } from "@allo-team/allo-v2-sdk/dist/Registry/types";
import { sendTransaction } from "@wagmi/core";

// Create a new Registry instance
const registry = new Registry({
  chain: 11155111,
  rpc: "https://sepolia.infura.io/v3/56ce63e709fb4d8eace0e1622a87ea7d",
});

// NOTE: Update this function to use your own data.
export const createProfile = async () => {
  // prepare the profile arguments, these are specifically typed and will fail if not correct.
  // We import the type from the SDK to ensure we are using the correct type.
  // todo: update the members and owner to your own address(es)
  // Prepare the transaction arguments
  const createProfileArgs: CreateProfileArgs = {
    nonce: Math.floor(Math.random() * 1000000),
    name: "Allo Workshop",
    metadata: {
      protocol: BigInt(1),
      pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
    },
    members: [
      "0x32B2304953a56Be7eb58a5b564Be1b6A5358761A"
    ],
    owner: "0x32B2304953a56Be7eb58a5b564Be1b6A5358761A",
  };

  // Create the transaction with the arguments
  const txData: TransactionData = registry.createProfile(createProfileArgs);

  const txHash = await sendTransaction({
    to: txData.to,
    data: txData.data,
    value: BigInt(txData.value),
  });

  console.log(`Transaction hash: ${txHash}`);
  
  const receipt = await wagmiConfigData.publicClient.waitForTransactionReceipt({
    hash: txHash.hash,
    confirmations: 2,
  });

  const profileId =
    getEventValues(receipt, RegistryABI, "ProfileCreated").profileId || "0x";

  if (profileId === "0x") {
    throw new Error("Profile creation failed");
  }

  return profileId;
};
