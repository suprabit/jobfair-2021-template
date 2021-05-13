import { connect as mqttConnect } from "mqtt";
import { eddsa } from "elliptic";
import Web3 from "web3";
import { config as configDotEnv } from "dotenv";
import { checkForEnvironmentVariables, parseAbiFile } from "./helpers";
import { SensorDataCollection } from "./interfaces";

const MQTT_BROKER = "mqtt://broker.hivemq.com";

/**
 * IMPORTANT:
 * Set your User ID here!
 */
const USER_ID = "SET_YOUR_USER_ID_HERE";

// Load .env variables
const dotenv = configDotEnv();

// Check if the required variables exist
const required_envs = ["CONTRACT_ADDRESS", "INFURA_PROVIDER"];
// throws Error if some variable is missing from .env
checkForEnvironmentVariables(required_envs);

// Prepare elliptic curve digital signature algorithm
const ec = new eddsa("ed25519");

// Prepare the web3 provider
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_PROVIDER || "")
);

// Parse the ABI file
const abi = parseAbiFile("./DeviceRegistry.json");

const DeviceRegisterContract = new web3.eth.Contract(
  abi,
  process.env.CONTRACT_ADDRESS
);

/**
 * This file should contain answers you send for validation
 */
let answer: SensorDataCollection = {};

const mqttClient = mqttConnect(MQTT_BROKER);

mqttClient.on('connect', async (packet) => {
  // Register as a new client
  mqttClient.publish('jobfair/register', USER_ID);
  // Subscribe to tasks
  mqttClient.subscribe(`jobfair/tasks/${USER_ID}`);
});


mqttClient.on('message', async (topic, message) => {

  console.log(`Topic: ${topic}, message: ${message.toString()}`);

  /**
   *  Check if tasks have been received:   
   */
  if(topic.startsWith('jobfair/tasks')) {
    const tasks = JSON.parse(message.toString());
    /**
     *   -> if yes:
     *        -> parse tasks, for each task:
     *          -> subscribe to sensor data
     *          -> fetch sensor's public key by calling DeviceRegistry smart contract
     */
  }

  /**
   * Check if sensor data has been received:
   *  -> if yes:
   *          -> parse sensor data
   *          -> hash received payload
   *          -> get sensor's public key
   *          -> verify if signature is valid
   */

  /**
   * When all data collected, publish data to topic
   * jobfair/results/<USER_ID>
   */
});

// Fetch public keys
// Example:
/*
    // Example with async/await
    const publicKey = await DeviceRegisterContract.methods.getDevice("0x1234567123456712345671234567123456712345671234567123456712345678").call();

    // Example with callback
    DeviceRegisterContract.methods.getDevice("0x1234567123456712345671234567123456712345671234567123456712345678").call((err: Error, data: any) => {
      console.log("Got public key: " + data);
    })
*/

// Validate received data
// Example:
/*
    let pubKey = "0x1111111";
    if(pubKey.startsWith("0x")){
      pubKey = pubKey.substr(2);
    } 
    ec.keyFromPublic(pubKey).verify('<message>', '<signature>')
*/
