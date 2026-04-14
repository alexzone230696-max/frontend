const API_BASE = "https://asas-black.vercel.app";

export interface ApiConfig {
  apiKey: string;
  chainLink: string;
  networkType: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

async function apiCall<T = any>(
  endpoint: string,
  config: ApiConfig,
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    headerkeys: config.apiKey,
    chainlinks: config.chainLink,
    networktype: config.networkType,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body ?? {}),
  });

  return res.json();
}

export function createWallet(config: ApiConfig) {
  return apiCall("/create-wallet", config);
}

export function checkBalance(
  config: ApiConfig,
  address: string,
  type: number,
  contractAddress?: string
) {
  return apiCall("/check-wallet-balance", config, {
    address,
    type,
    contract_address: contractAddress,
  });
}

export function sendEth(
  config: ApiConfig,
  body: {
    from_address: string;
    to_address: string;
    amount_value: string;
    private_key: string;
    gas_limit?: number;
    chain_id?: number;
  }
) {
  return apiCall("/send-eth", config, body);
}

export function sendToken(
  config: ApiConfig,
  body: {
    from_address: string;
    to_address: string;
    amount_value: string;
    private_key: string;
    contract_address: string;
    gas_limit?: number;
  }
) {
  return apiCall("/send-token", config, body);
}

export function checkEstimateGas(
  config: ApiConfig,
  body: {
    from_address: string;
    to_address: string;
    amount_value: string;
    contract_address?: string;
    gas_limit?: number;
    chain_id?: number;
  }
) {
  return apiCall("/check-estimate-gas", config, body);
}

export function getTransactionData(config: ApiConfig, hash: string) {
  return apiCall("/get-transaction-data", config, { transaction_hash: hash });
}

export function getNetworkId(config: ApiConfig) {
  return apiCall("/get-network-id", config);
}

export function getContractDetails(config: ApiConfig, contractAddress: string) {
  return apiCall("/get-contract-details", config, { contract_address: contractAddress });
}

export function getAddressByPk(config: ApiConfig, privateKey: string) {
  return apiCall("/get-address-by-pk", config, { private_key: privateKey });
}

export function getTransferEvents(config: ApiConfig, contractAddress: string, address: string) {
  return apiCall("/get-transfer-event", config, { contract_address: contractAddress, address });
}

// TRX endpoints
export function getTrxAccount(config: ApiConfig) {
  return apiCall("/get-trx-account", config);
}

export function getTrxAddressByPk(config: ApiConfig, privateKey: string) {
  return apiCall("/get-trx-address", config, { private_key: privateKey });
}

export function checkTrxAddress(config: ApiConfig, address: string) {
  return apiCall("/check-trx-address", config, { address });
}

export function getTrxTransaction(config: ApiConfig, hash: string) {
  return apiCall("/get-trx-transaction", config, { trx_hash: hash });
}

export function getTrxEstimateGas(config: ApiConfig, body: Record<string, any>) {
  return apiCall("/get-trx-estimate-gas", config, body);
}
