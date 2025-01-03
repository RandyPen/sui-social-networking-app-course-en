import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from '@mysten/sui/bcs';

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);

const PACKAGE: string = '0xf88ed6fdffa373a09a1a54fbad1ac4730219142f7fa798bdcf632d5f159e4a18';
const tx = new Transaction();
const [profile] = tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "new",
    arguments: [
        tx.pure(bcs.string().serialize("Example").toBytes()),
    ],
});
tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "click",
    arguments: [
        profile,
        tx.object("0x6"),
    ],
});
tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "burn",
    arguments: [
        profile,
    ],
});
const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
console.log(result);