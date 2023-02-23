import {aliceActor} from "./icp"

async function main() {
    const publicKey = await aliceActor.public_key();
    console.log("public key: ", (publicKey as any)?.Ok.public_key);
}
main();