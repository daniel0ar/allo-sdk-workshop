import { createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

export const client = createWalletClient({
  chain: sepolia,
  transport: http(),
})

export const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`)