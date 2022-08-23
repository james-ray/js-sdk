const web3 = require("@solana/web3.js");
const BN = require('bn.js')
const bs58 = require('bs58');
const Cluster = require('@solana/wallet-adapter-base');
const StreamClient = require('./StreamClient.ts')

// import { Wallet } from "@project-serum/anchor";
// import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

// import { requestAirdrop } from "./test-lib/airdrop/airdrop-request.js";
// import { AIRDROP_AMOUNT } from "./test-lib/constants";
// import { TX_FINALITY_CONFIRMED } from "./test-lib/constants";


let secretKey = Uint8Array.from([5,99,252,29,239,43,17,23,212,19,135,200,194,173,254,195,130,226,145,211,9,215,44,232,177,57,171,114,197,107,112,218,201,102,238,169,53,10,176,73,102,210,221,50,116,161,113,27,50,192,42,194,52,9,131,70,237,245,80,44,226,90,122,255]
);
// let sender = new Wallet(web3.Keypair.generate());
//let secretKey=bs58.decode("4mjycSgo5soR97uvAdRp6adZ7XP9h9umj4wwGQi4kF2Am8iDL8kmwAbyUpT2T71ERocPhdRpLGuBTHyrbw8QTfYK");
let sk = web3.Keypair.fromSecretKey(secretKey);
console.log('keypair imported, pubkey:', sk.publicKey.toBase58());
let sender = sk;
let recipient = "37N2u6veYfL7GiJwBZsb9tCf8tHciTWJB6nov8hxDaP3";
let mint = "CGp3SSqwe91Q4UrVL4wp8Tqsd6Q2AuyUzrjLj6yLwTwx";
// console.log(sender)

/*const sClient = new StreamClient(
  "https://api.devnet.solana.com",
  Cluster.Devnet,
  "confirmed"
);*/
const sClient = new StreamClient(
    "http://localhost:8899",
    Cluster.Devnet,
    "confirmed",
    "Gd6bPXBkSoAanQhnpYiCjhU5zz5puTLW8fhyBsEiBmmw"
);

const run = async () => {
  // requestAirdrop(sender, sClient.connection)

  const createStreamParams = {
    sender: sender, // Wallet/Keypair signing the transaction, creating and sending the stream.
    recipient: recipient, // Solana recipient address.
    mint: mint, // SPL Token mint.
    start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
    depositedAmount: getBN(100, 9), // depositing 100 tokens with 9 decimals mint.
    period: 1, // Time step (period) in seconds per which the unlocking occurs.
    cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
    cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
    amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
    name: "Transfer to Jane Doe.", // The stream name or subject.
    canTopup: false, // setting to FALSE will effectively create a vesting contract.
    cancelableBySender: true, // Whether or not sender can cancel the stream.
    cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
    transferableBySender: true, // Whether or not sender can transfer the stream.
    transferableByRecipient: false, // Whether or not recipient can transfer the stream.
    // automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
    // withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
    // partner: null, //  (optional) Partner's wallet address (string | null).
  };

  const a = await sClient.create(createStreamParams);
  console.log(a);
  return a
}

run().catch(console.error);

// const wallet = Wallet.

// const createStreamParams = {
//   sender: sender, // Wallet/Keypair signing the transaction, creating and sending the stream.
//   recipient: recipient, // Solana recipient address.
//   mint: mint, // SPL Token mint.
//   start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
//   depositedAmount: getBN(100, 9), // depositing 100 tokens with 9 decimals mint.
//   period: 1, // Time step (period) in seconds per which the unlocking occurs.
//   cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
//   cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
//   amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
//   name: "Transfer to Jane Doe.", // The stream name or subject.
//   canTopup: false, // setting to FALSE will effectively create a vesting contract.
//   cancelableBySender: true, // Whether or not sender can cancel the stream.
//   cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
//   transferableBySender: true, // Whether or not sender can transfer the stream.
//   transferableByRecipient: false, // Whether or not recipient can transfer the stream.
//   automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
//   withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
//   partner: null, //  (optional) Partner's wallet address (string | null).
// };
//
// export const fn = async () => {
//   // console.log(createStreamParams)
//   const a = await sClient.create(createStreamParams);
//   // console.log(a)
//   return a
// }

