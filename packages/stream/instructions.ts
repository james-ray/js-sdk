import { Buffer } from "buffer";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { sha256 } from "js-sha256";

import * as Layout from "./layout";

interface CreateStreamData {
  start: BN;
  depositedAmount: BN;
  period: BN;
  amountPerPeriod: BN;
  cliff: BN;
  cliffAmount: BN;
  cancelableBySender: boolean;
  cancelableByRecipient: boolean;
  automaticWithdrawal: boolean;
  transferableBySender: boolean;
  transferableByRecipient: boolean;
  canTopup: boolean;
  name: string;
  withdrawFrequency: BN;
}

interface CreateStreamAccounts {
  sender: PublicKey;
  senderTokens: PublicKey;
  recipient: PublicKey;
  recipientTokens: PublicKey;
  metadata: PublicKey;
  escrowTokens: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryTokens: PublicKey;
  partner: PublicKey;
  partnerTokens: PublicKey;
  mint: PublicKey;
  feeOracle: PublicKey;
  rent: PublicKey;
  timelockProgram: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  withdrawor: PublicKey;
  systemProgram: PublicKey;
}

export const createStreamInstruction = (
  data: CreateStreamData,
  programId: PublicKey,
  accounts: CreateStreamAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: accounts.sender, isSigner: true, isWritable: true },
    { pubkey: accounts.senderTokens, isSigner: false, isWritable: true },
    { pubkey: accounts.recipient, isSigner: false, isWritable: true },
    { pubkey: accounts.metadata, isSigner: true, isWritable: true },
    { pubkey: accounts.escrowTokens, isSigner: false, isWritable: true },
    { pubkey: accounts.recipientTokens, isSigner: false, isWritable: true },
    {
      pubkey: accounts.streamflowTreasury,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.streamflowTreasuryTokens,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.withdrawor, isSigner: false, isWritable: true },
    { pubkey: accounts.partner, isSigner: false, isWritable: true },
    { pubkey: accounts.partnerTokens, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.feeOracle, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.timelockProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];

  let bufferData = Buffer.alloc(Layout.createStreamLayout.span);

  const encodedUIntArray = new TextEncoder().encode(data.name);
  let streamNameBuffer = Buffer.alloc(64).fill(
    encodedUIntArray,
    0,
    encodedUIntArray.byteLength
  );

  const decodedData = {
    start_time: data.start.toArrayLike(Buffer, "le", 8),
    net_amount_deposited: data.depositedAmount.toArrayLike(Buffer, "le", 8),
    period: data.period.toArrayLike(Buffer, "le", 8),
    amount_per_period: data.amountPerPeriod.toArrayLike(Buffer, "le", 8),
    cliff: data.cliff.toArrayLike(Buffer, "le", 8),
    cliff_amount: data.cliffAmount.toArrayLike(Buffer, "le", 8),
    cancelable_by_sender: data.cancelableBySender,
    cancelable_by_recipient: data.cancelableByRecipient,
    automatic_withdrawal: data.automaticWithdrawal,
    transferable_by_sender: data.transferableBySender,
    transferable_by_recipient: data.transferableByRecipient,
    can_topup: data.canTopup,
    stream_name: streamNameBuffer,
    withdraw_frequency: data.withdrawFrequency.toArrayLike(Buffer, "le", 8),
  };
  const encodeLength = Layout.createStreamLayout.encode(
    decodedData,
    bufferData
  );
  bufferData = bufferData.slice(0, encodeLength);
  bufferData = Buffer.concat([
    Buffer.from("0").slice(0, 8), //  Buffer.from(sha256.digest("global:create")).slice(0, 8),
    bufferData,
    Buffer.alloc(10)
  ]);
  console.log("444444444444444")
  console.log("bufferData: "+bufferData)

  return new TransactionInstruction({
    keys,
    programId,
    data: bufferData,
  });
};

interface CreateUncheckedStreamData {
  start: BN;
  depositedAmount: BN;
  period: BN;
  amountPerPeriod: BN;
  cliff: BN;
  cliffAmount: BN;
  cancelableBySender: boolean;
  cancelableByRecipient: boolean;
  automaticWithdrawal: boolean;
  transferableBySender: boolean;
  transferableByRecipient: boolean;
  canTopup: boolean;
  name: string;
  withdrawFrequency: BN;
  recipient: PublicKey;
  partner: PublicKey;
  
}

interface CreateUncheckedStreamAccounts {
  sender: PublicKey;
  senderTokens: PublicKey;
  metadata: PublicKey;
  escrowTokens: PublicKey;
  mint: PublicKey;
  feeOracle: PublicKey;
  rent: PublicKey;
  timelockProgram: PublicKey;
  tokenProgram: PublicKey;
  withdrawor: PublicKey;
  systemProgram: PublicKey;
}

export const createUncheckedStreamInstruction = (
  data: CreateUncheckedStreamData,
  programId: PublicKey,
  accounts: CreateUncheckedStreamAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: accounts.sender, isSigner: true, isWritable: true },
    { pubkey: accounts.senderTokens, isSigner: false, isWritable: true },
    { pubkey: accounts.metadata, isSigner: false, isWritable: true },
    { pubkey: accounts.escrowTokens, isSigner: false, isWritable: true },
    { pubkey: accounts.withdrawor, isSigner: false, isWritable: true },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.feeOracle, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.timelockProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];

  let bufferData = Buffer.alloc(Layout.createUncheckedStreamLayout.span);

  const encodedUIntArray = new TextEncoder().encode(data.name);
  let streamNameBuffer = Buffer.alloc(64).fill(
    encodedUIntArray,
    0,
    encodedUIntArray.byteLength
  );

  const decodedData = {
    start_time: data.start.toArrayLike(Buffer, "le", 8),
    net_amount_deposited: data.depositedAmount.toArrayLike(Buffer, "le", 8),
    period: data.period.toArrayLike(Buffer, "le", 8),
    amount_per_period: data.amountPerPeriod.toArrayLike(Buffer, "le", 8),
    cliff: data.cliff.toArrayLike(Buffer, "le", 8),
    cliff_amount: data.cliffAmount.toArrayLike(Buffer, "le", 8),
    cancelable_by_sender: data.cancelableBySender,
    cancelable_by_recipient: data.cancelableByRecipient,
    automatic_withdrawal: data.automaticWithdrawal,
    transferable_by_sender: data.transferableBySender,
    transferable_by_recipient: data.transferableByRecipient,
    can_topup: data.canTopup,
    stream_name: streamNameBuffer,
    withdraw_frequency: data.withdrawFrequency.toArrayLike(Buffer, "le", 8),
    recipient: data.recipient.toBuffer(),
    partner: data.partner.toBuffer(),
    pausable: Buffer.alloc(1),
    can_update_rate: Buffer.alloc(1),
  };
  const encodeLength = Layout.createUncheckedStreamLayout.encode(
    decodedData,
    bufferData
  );
  bufferData = bufferData.slice(0, encodeLength);
  bufferData = Buffer.concat([
    Buffer.from(sha256.digest("global:create_unchecked")).slice(0, 8),
    bufferData,
    Buffer.alloc(10),
  ]);

  return new TransactionInstruction({
    keys,
    programId,
    data: bufferData,
  });
};

interface WithdrawAccounts {
  authority: PublicKey;
  recipient: PublicKey;
  recipientTokens: PublicKey;
  metadata: PublicKey;
  escrowTokens: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryTokens: PublicKey;
  partner: PublicKey;
  partnerTokens: PublicKey;
  mint: PublicKey;
  tokenProgram: PublicKey;
}

export const withdrawStreamInstruction = (
  amount: BN,
  programId: PublicKey,
  {
    authority,
    recipient,
    recipientTokens,
    metadata,
    escrowTokens,
    streamflowTreasury,
    streamflowTreasuryTokens,
    partner,
    partnerTokens,
    mint,
    tokenProgram,
  }: WithdrawAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: authority, isSigner: true, isWritable: true },
    { pubkey: recipient, isSigner: false, isWritable: true },
    { pubkey: recipientTokens, isSigner: false, isWritable: true },
    { pubkey: metadata, isSigner: false, isWritable: true },
    { pubkey: escrowTokens, isSigner: false, isWritable: true },
    {
      pubkey: streamflowTreasury,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
    { pubkey: partner, isSigner: false, isWritable: true },
    { pubkey: partnerTokens, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: tokenProgram, isSigner: false, isWritable: false },
  ];

  let data = Buffer.alloc(Layout.withdrawStreamLayout.span);
  const decodedData = { amount: amount.toArrayLike(Buffer, "le", 8) };
  const encodeLength = Layout.withdrawStreamLayout.encode(decodedData, data);
  data = data.slice(0, encodeLength);
  data = Buffer.concat([
    Buffer.from(sha256.digest("global:withdraw")).slice(0, 8),
    data,
    Buffer.alloc(10)
  ]);

  return new TransactionInstruction({
    keys,
    programId,
    data,
  });
};

interface CancelAccounts {
  authority: PublicKey;
  sender: PublicKey;
  senderTokens: PublicKey;
  recipient: PublicKey;
  recipientTokens: PublicKey;
  metadata: PublicKey;
  escrowTokens: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryTokens: PublicKey;
  partner: PublicKey;
  partnerTokens: PublicKey;
  mint: PublicKey;
  tokenProgram: PublicKey;
}

export const cancelStreamInstruction = (
  programId: PublicKey,
  {
    authority,
    sender,
    senderTokens,
    recipient,
    recipientTokens,
    metadata,
    escrowTokens,
    streamflowTreasury,
    streamflowTreasuryTokens,
    partner,
    partnerTokens,
    mint,
    tokenProgram,
  }: CancelAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: authority, isSigner: true, isWritable: false },
    { pubkey: sender, isSigner: false, isWritable: true },
    { pubkey: senderTokens, isSigner: false, isWritable: true },
    { pubkey: recipient, isSigner: false, isWritable: true },
    { pubkey: recipientTokens, isSigner: false, isWritable: true },
    { pubkey: metadata, isSigner: false, isWritable: true },
    { pubkey: escrowTokens, isSigner: false, isWritable: true },
    {
      pubkey: streamflowTreasury,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
    { pubkey: partner, isSigner: false, isWritable: true },
    { pubkey: partnerTokens, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: tokenProgram, isSigner: false, isWritable: false },
  ];

  const data = Buffer.concat([
    Buffer.from(sha256.digest("global:cancel")).slice(0, 8),
    Buffer.alloc(10),
  ]);

  return new TransactionInstruction({
    keys,
    programId,
    data,
  });
};

interface TransferAccounts {
  authority: PublicKey;
  newRecipient: PublicKey;
  newRecipientTokens: PublicKey;
  metadata: PublicKey;
  mint: PublicKey;
  rent: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  systemProgram: PublicKey;
}

export const transferStreamInstruction = (
  programId: PublicKey,
  {
    authority,
    newRecipient,
    newRecipientTokens,
    metadata,
    mint,
    rent,
    tokenProgram,
    associatedTokenProgram,
    systemProgram,
  }: TransferAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: authority, isSigner: true, isWritable: true },
    { pubkey: newRecipient, isSigner: false, isWritable: true },
    { pubkey: newRecipientTokens, isSigner: false, isWritable: true },
    { pubkey: metadata, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: rent, isSigner: false, isWritable: false },
    { pubkey: tokenProgram, isSigner: false, isWritable: false },
    { pubkey: associatedTokenProgram, isSigner: false, isWritable: false },
    { pubkey: systemProgram, isSigner: false, isWritable: false },
  ];

  const data = Buffer.concat([
    Buffer.from(sha256.digest("global:transfer_recipient")).slice(0, 8),
    Buffer.alloc(10),
  ]);

  return new TransactionInstruction({
    keys,
    programId,
    data,
  });
};

interface TopupAccounts {
  sender: PublicKey;
  senderTokens: PublicKey;
  metadata: PublicKey;
  escrowTokens: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryTokens: PublicKey;
  partner: PublicKey;
  partnerTokens: PublicKey;
  mint: PublicKey;
  tokenProgram: PublicKey;
  withdrawor: PublicKey;
  systemProgram: PublicKey;
}

export const topupStreamInstruction = (
  amount: BN,
  programId: PublicKey,
  {
    sender,
    senderTokens,
    metadata,
    escrowTokens,
    streamflowTreasury,
    streamflowTreasuryTokens,
    partner,
    partnerTokens,
    mint,
    tokenProgram,
    withdrawor,
    systemProgram,
  }: TopupAccounts
): TransactionInstruction => {
  const keys = [
    { pubkey: sender, isSigner: true, isWritable: true },
    { pubkey: senderTokens, isSigner: false, isWritable: true },
    { pubkey: metadata, isSigner: false, isWritable: true },
    { pubkey: escrowTokens, isSigner: false, isWritable: true },
    {
      pubkey: streamflowTreasury,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
    { pubkey: withdrawor, isSigner: false, isWritable: true },
    { pubkey: partner, isSigner: false, isWritable: true },
    { pubkey: partnerTokens, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: tokenProgram, isSigner: false, isWritable: false },
    { pubkey: systemProgram, isSigner: false, isWritable: false },
  ];

  let data = Buffer.alloc(Layout.topupStreamLayout.span);
  const decodedData = { amount: amount.toArrayLike(Buffer, "le", 8) };

  const encodeLength = Layout.topupStreamLayout.encode(decodedData, data);
  data = data.slice(0, encodeLength);
  data = Buffer.concat([
    Buffer.from(sha256.digest("global:topup")).slice(0, 8),
    data,
    Buffer.alloc(10)
  ]);

  return new TransactionInstruction({
    keys,
    programId,
    data,
  });
};
