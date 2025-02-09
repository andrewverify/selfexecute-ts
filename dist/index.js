"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers"); //ethers-v6
// Trade Info (Insert your values)
const privateKey = "";
const tokensAddressesSell = ["0x4200000000000000000000000000000000000006"]; // WETH
const tokensSellAmounts = [ethers_1.ethers.parseEther("0.001")]; // 0.001 WETH
const tokensAddressBuy = ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"]; // USDC
const chain = {
    chainId: 8453,
    name: "base" // "polygon" | "ethereum" | "arbitrum" | "blast" | "optimism"
};
const provider = new ethers_1.ethers.JsonRpcProvider("https://mainnet.base.org");
// Getting quote and submitting it onchain
async function sendTx() {
    // Init you wallet
    let account = new ethers_1.ethers.Wallet(privateKey);
    // Get quote
    let quote = (await axios_1.default.get(`https://api.bebop.xyz/pmm/${chain.name}/v3/quote`, {
        params: {
            buy_tokens: tokensAddressBuy.toString(),
            sell_tokens: tokensAddressesSell.toString(),
            sell_amounts: tokensSellAmounts.toString(),
            taker_address: account.address,
            gasless: false
        }
    })).data;
    console.log(quote);
    if (quote.error !== undefined) {
        return;
    }
    // Send the transaction
    let txHash = await account.connect(provider).sendTransaction(quote.tx);
    console.log(txHash);
}
sendTx();
