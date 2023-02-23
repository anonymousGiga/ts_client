import {setIcpClient, updateState, getPublicKey, signMessages} from "./icp"

async function main() {
    await getPublicKey();
}
main();