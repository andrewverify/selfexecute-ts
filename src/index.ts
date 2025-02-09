import axios from "axios";
import {ethers} from "ethers"; //ethers-v6

// Trade Info (Insert your values)
const privateKey = ""
const tokensAddressesSell = ["0x4200000000000000000000000000000000000006"] // WETH
const tokensSellAmounts = [ethers.parseEther("0.001")] // 0.001 WETH
const tokensAddressBuy = ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"] // USDC
const chain = {
    chainId: 8453,
    name: "base" // "polygon" | "ethereum" | "arbitrum" | "blast" | "optimism"
}
const provider = new ethers.JsonRpcProvider("https://mainnet.base.org")

// Getting quote and submitting it onchain
async function sendTx() {

    // Init you wallet
    let account = new ethers.Wallet(privateKey)

    // Get quote
    let quote = (await axios.get(`https://api.bebop.xyz/pmm/${chain.name}/v3/quote`, {
        params: {
            buy_tokens: tokensAddressBuy.toString(),
            sell_tokens: tokensAddressesSell.toString(),
            sell_amounts: tokensSellAmounts.toString(),
            taker_address: account.address,
            gasless: false,
            skip_validation: true
        }
    })).data
    console.log(quote)
    if (quote.error !== undefined) {
        return
    }

    // Send the transaction
    let txHash = await account.connect(provider).sendTransaction(quote.tx)
    console.log(txHash)
}

sendTx()