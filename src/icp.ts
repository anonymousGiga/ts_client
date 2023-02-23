import fetch from "isomorphic-fetch";
import {Actor, HttpAgent, Identity} from "@dfinity/agent";
import {Ed25519KeyIdentity} from "@dfinity/identity";
import {idlFactory} from "./factory/idl";
import {_SERVICE as Service} from "./factory/idl.d";

const host = "https://ic0.app";    
const canisterId = "3udup-lqaaa-aaaan-qc5ua-cai";
const aliceIdentity = Ed25519KeyIdentity.generate();


const createActor = async (identity: Identity): Promise<Service> => {
  const agent = new HttpAgent({host, fetch, identity});

  const actor = Actor.createActor<Service>(idlFactory, {
    canisterId: canisterId,
    agent
  });

  // Fetch root key for certificate validation during development
  await agent.fetchRootKey().catch(err => {
    console.error("Unable to fetch root key. Check to ensure that your local replica is running");
    throw err;
  });

  return actor;
};

const aliceActor = await createActor(aliceIdentity);


export async function setIcpClient(chainId: string, initialPublicKeys: string []) {
    const ret = await aliceActor.set_client(chainId, initialPublicKeys);
    console.log("after set client: ", ret);
}

export async function updateState(state: Uint8Array) {
    const ret = await aliceActor.update_state(state);
    console.log("after set client: ", ret);
}

export async function getPublicKey(): Promise<number[] | undefined> {
    const result = await aliceActor.public_key();
    console.log("public key: ", result);
    return (result as any).Ok.public_key;
}

export async function signMessages(messages: Uint8Array, header: Uint8Array, mmrLeaf: Uint8Array, mmrProof: Uint8Array): Promise<number[] | undefined> {
    const result = await aliceActor.sign_messages2(messages, header, mmrLeaf, mmrProof);
    console.log("signature is: ", result);
    return (result as any).Ok;
}
