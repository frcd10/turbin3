import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
const envText = readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const value = trimmed.slice(idx + 1).trim();
  if (!process.env[key]) process.env[key] = value;
}

const jwt = process.env.PINATA_JWT;
const apiKey = process.env.PINATA_API;
const apiSecret = process.env.PINATA_SECRET;

const metadata = {
  name: "Turbin3 Blchead task2Token",
  symbol: "T3Blchead",
  description: "Task2 turbine q126",
  image: "https://i.ibb.co/rKtKmXLP/nft-task.webp",
  attributes: [],
};


const headers: Record<string, string> = { "Content-Type": "application/json" };
if (jwt) {
  headers.Authorization = `Bearer ${jwt}`;
} else if (apiKey && apiSecret) {
  headers.pinata_api_key = apiKey;
  headers.pinata_secret_api_key = apiSecret;
} else {
  throw new Error("Missing PINATA_JWT or PINATA_API/PINATA_SECRET in .env");
}

(async () => {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers,
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinata upload failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { IpfsHash: string };
  const uri = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  console.log(uri);
})();
