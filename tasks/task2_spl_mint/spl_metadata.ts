import wallet from "../../solana-starter/ts/turbin3-wallet.json"
import { config } from "dotenv";
import { resolve } from "path";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    findMetadataPda
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

config({ path: resolve(__dirname, "../../solana-starter/ts/.env") });

// Define our Mint address
const mint = publicKey("2tnUn9is5s8Xmdv3Usncsoe9x1fRn2u5ndX9vjR9BydX");

// Create a UMI connection
const umi = createUmi(process.env.SOLANA_RPC_URL!);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
    try {
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            metadata: findMetadataPda(umi, { mint }),
            mint,
            mintAuthority: signer,
            payer: signer,
            updateAuthority: signer,
        };

        let data: DataV2Args = {
            name: "Turbin3 Blchead task2Token",
            symbol: "T3Blchead",
            uri: "https://gateway.pinata.cloud/ipfs/QmXsA35f9dEwN9s21qpG1QAUmSnZJeRACsBRph3WQc3F2W",
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        };

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null,
        };

        let tx = createMetadataAccountV3(umi, {
            ...accounts,
            ...args,
        });

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
