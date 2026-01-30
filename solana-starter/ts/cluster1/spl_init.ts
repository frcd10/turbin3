import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";
import "dotenv/config";


// Sanity check wallet JSON format
if (!Array.isArray(wallet)) {
  throw new Error(`turbin3-wallet.json must be a JSON number array, got: ${typeof wallet}`);
}
console.log("wallet length:", wallet.length);

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
console.log("wallet pubkey:", keypair.publicKey.toBase58());

const commitment: Commitment = "confirmed";
const connection = new Connection(process.env.SOLANA_RPC_URL!, commitment);

async function main() {
  // Sanity check RPC compatibility
  const v = await connection.getVersion();
  console.log("rpc version:", v);

  const mint = await createMint(connection, keypair, keypair.publicKey, null, 9);
  console.log(`Mint Address: ${mint.toBase58()}`);
}

main().catch((err) => {
  console.error("Oops, something went wrong:");
  console.error(err);
  process.exitCode = 1;
});