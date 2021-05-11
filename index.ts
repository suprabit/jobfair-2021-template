import {connect as mqttConnect} from 'mqtt';
import { eddsa } from 'elliptic';
import Web3 from "web3";
import { readFileSync } from 'fs';
import {config as configDotEnv} from "dotenv";

const MQTT_BROKER = "mqtt://broker.hivemq.com";

// Load .env variables
const dotenv = configDotEnv();

// Check if the required variables exist
const required_envs = ["CONTRACT_ADDRESS", "INFURA_PROVIDER"];
required_envs.forEach(env => {
  if(! process.env[env]) {
    throw new Error(`Missing .env variable ${env}`);
  }
});


// Prepare elliptic curve digital signature algorithm
const ec = new eddsa("ed25519");

// Prepare the web3 provider
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    process.env.INFURA_PROVIDER || ""
  )
);

// Parse the ABI file
const abiFile = readFileSync("./DeviceRegistry.json");
const abi = JSON.parse(abiFile.toString());
if (!abi) {
  throw new Error("Could not parse contract abi file");
}
const DeviceRegisterContract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

const mqttClient = mqttConnect(MQTT_BROKER);

// Register as a new client

// Fetch the tasks

// Fetch public keys
// Example: 
/*
    DeviceRegisterContract.methods.getDevice("0x1234567123456712345671234567123456712345671234567123456712345678").call((err: Error, data: any) => {
      console.log("Got public key: " + data);
    })
*/

// Fetch the data from devices

// Validate received data
// Example:
/*
    ec.keyFromPublic('<publicKey>').verify('<message>', '<signature>')
*/

// Send validated data