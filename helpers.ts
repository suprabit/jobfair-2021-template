import { readFileSync } from "fs";
import { AbiItem } from "web3-utils";

/**
 * Function used to check if all of the required variables are present
 * in the environment variables.
 * 
 * @param requiredVariables list of required environment variables
 * @returns true if all required variables are present, otherwise throws an Error
 */
export const checkForEnvironmentVariables = (requiredVariables: string[]): boolean => {
  requiredVariables.forEach(env => {
    if(! process.env[env]) {
      throw new Error(`Missing .env variable ${env}`);
    }
  });

  return true;
}

/**
 * Function used to parse an ABI json file into AbiItem object.
 * 
 * @param filePath Path of the ABI Json file
 * @returns AbiItem object containing parsed contract ABI
 */
export const parseAbiFile = (filePath: string): AbiItem => {
  const abiFile = readFileSync(filePath);
  const abi = JSON.parse(abiFile.toString());

  if (!abi) {
    throw new Error("Could not parse contract abi file");
  }

  return abi;
}