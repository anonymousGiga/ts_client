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

export const aliceActor = await createActor(aliceIdentity);
