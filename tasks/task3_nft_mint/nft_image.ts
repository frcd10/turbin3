import wallet from "../../solana-starter/ts/turbin3-wallet.json"
import { config } from "dotenv";
import { resolve } from "path";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { resolve } from "path"

// Create a devnet connection
const umi = createUmi(process.env.SOLANA_RPC_URL!);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {

        const image = await readFile(resolve(__dirname, "nft_task.png"));
        const file =  createGenericFile(image, "nft_task.png", { contentType: "image/png" });
        const [myUri] = await umi.uploader.upload([file]);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
