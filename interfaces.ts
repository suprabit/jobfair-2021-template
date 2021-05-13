export interface RawData {
  [key: string]: any,
  timestamp?: string
}

export interface SensorData {
  payload: any,
  hashingAlg: string,
  signature: string
}

export interface SensorDataCollection {
  [key: string]: SensorData
}

export interface UserResults {
  tasks: string[],
  correct: string[]
}