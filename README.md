# JobFair 2021 Suprabit Workshop: Blockchain in IoT

Goal of this task is to demonstrate how can we utilize Blockchain technology to produce the end-to-end protected data in the IoT.
Each user will receive a unique set of sensor IDs, and his goal will be to collect a data packet from each sensor. 
The collected data packet needs to be verifiable that it was produced by the original sensor, and not by a malicious third party.   

## Instructions
- Register on [Infura](https://infura.io/) and create a token
- Run `npm install` to install all required dependencies
- Run the script with `npm start`

## Docs
- elliptic curve library: https://github.com/indutny/elliptic#eddsa
- mqtt library: https://github.com/mqttjs/MQTT.js#example
- web3 library: https://web3js.readthedocs.io/en/v1.3.4/

## Task
### 1. step: Registration
Firstly, users need to register in order to receive their tasks - a set of sensor IDs.
Registration is done by publishing `userID` to the `jobfair/register` MQTT topic.

### 2. step: Collect task
After the registration, user needs to fetch the tasks by subscribing to the `jobfair/tasks/<userID>` MQTT topic.
Upon subscription, users will receive a message containing a list of sensor IDs in a `string[]`.


### 3. step: Collect public keys
In order to verify if the data packet was actually created by the sensor, and not some other malicious third party, user need to verify if the signature within the data packet is valid. Validity of the signature can only be checked with the public key of the sensor which is stored in the Device Registry smart contract.

User can fetch the public key of the sensor by calling a `getDevice(deviceID)` method of the smart contract, while `deviceID` is the `sensorID` in our case. `getDevice(deviceID)` method returns a string public key in a hex format.

### 4. step: Collect data from sensors
Sensors publish their data to a `jobfair/<sensorID>` MQTT topic.
Data is in a JSON format and it follows the next format:
```json
{
  payload: string,
  hashingAlg: string,
  signature: string
}
```

### 5. step: Send collected data to check validity
Users publish their collected data in a JSON format to a `jobfair/results/<userID>` MQTT topic. The format of the data should follow this:
```json
{
  <sensorID>: {
    payload: string,
    hashingAlg: string,
    signature: string
  },
  <sensorID>: {
    payload: string,
    hashingAlg: string,
    signature: string
  },
  ...
}
```

Example of a packet:
```json
{
  "134f7e539ec0948075eec8186b7329aa360939659fa18a7a062ee21a89ca5063": {
    "payload": "{\"humidity\":70,\"timestamp\":\"2021-05-11T12:47:33.288Z\"}",
    "hashingAlg": "sha256",
    "signature": "34E155F804CE7743692EA7655BE79C12E4052016FECAB999F5DAF98F8BB2768229D74DB1AB98B25DAA025FBB7A526346BD89CC4DBABE7EE91E0A327B27F16D0E"
  },
  "4f1aac3f300658f9560765b2373a2325026680a52be7719d3e7582b7c8e3bfa5": {
    "payload": "{\"ambient_light\":186,\"timestamp\":\"2021-05-11T12:47:33.472Z\"}",
    "hashingAlg": "sha256",
    "signature": "C06A99A5278D7C8948DCE1EAF655A607170BD40B63909B3F985F73AD1C47AB2092D2A6A0C3B9270352CB884FD54ADD18A043DA66898AB5DF3B88DFB1B6630F00"
  }
}

```