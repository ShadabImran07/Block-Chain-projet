const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    //http://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const encryptedJson = fs.readFileSync("./.encryptedKey.Json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const transactionResponse = await contract.store("8")
    const transactionReceipt = await transactionResponse.wait(1)

    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`updated Favorite Number: ${updatedFavoriteNumber.toString()}`)

    // sending transaction with raw data

    //   console.log("let's deploy with transaction data");
    //   const nonce = await wallet.getTransactionCount();
    //   const tx = {
    //     nonce: nonce,
    //     gasPrice: 20000000000,
    //     gasLimit: 1000000,
    //     to: null,
    //     value: 0,
    //     data: "0x608060405234801561001057600080fd5b506107a0806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632e64cec114610067578063471f7cdf146100855780636057361d146100a35780636f760f41146100bf5780638bab8dd5146100db5780639e7a13ad1461010b575b600080fd5b61006f61013c565b60405161007c9190610559565b60405180910390f35b61008d610145565b60405161009a9190610559565b60405180910390f35b6100bd60048036038101906100b8919061049c565b61014b565b005b6100d960048036038101906100d49190610440565b610155565b005b6100f560048036038101906100f091906103f7565b6101e5565b6040516101029190610559565b60405180910390f35b6101256004803603810190610120919061049c565b610213565b604051610133929190610574565b60405180910390f35b60008054905090565b60005481565b8060008190555050565b600160405180604001604052808381526020018481525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906101bb9291906102cf565b505050806002836040516101cf9190610542565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6001818154811061022357600080fd5b906000526020600020906002020160009150905080600001549080600101805461024c9061066d565b80601f01602080910402602001604051908101604052809291908181526020018280546102789061066d565b80156102c55780601f1061029a576101008083540402835291602001916102c5565b820191906000526020600020905b8154815290600101906020018083116102a857829003601f168201915b5050505050905082565b8280546102db9061066d565b90600052602060002090601f0160209004810192826102fd5760008555610344565b82601f1061031657805160ff1916838001178555610344565b82800160010185558215610344579182015b82811115610343578251825591602001919060010190610328565b5b5090506103519190610355565b5090565b5b8082111561036e576000816000905550600101610356565b5090565b6000610385610380846105c9565b6105a4565b9050828152602081018484840111156103a1576103a0610733565b5b6103ac84828561062b565b509392505050565b600082601f8301126103c9576103c861072e565b5b81356103d9848260208601610372565b91505092915050565b6000813590506103f181610753565b92915050565b60006020828403121561040d5761040c61073d565b5b600082013567ffffffffffffffff81111561042b5761042a610738565b5b610437848285016103b4565b91505092915050565b600080604083850312156104575761045661073d565b5b600083013567ffffffffffffffff81111561047557610474610738565b5b610481858286016103b4565b9250506020610492858286016103e2565b9150509250929050565b6000602082840312156104b2576104b161073d565b5b60006104c0848285016103e2565b91505092915050565b60006104d4826105fa565b6104de8185610605565b93506104ee81856020860161063a565b6104f781610742565b840191505092915050565b600061050d826105fa565b6105178185610616565b935061052781856020860161063a565b80840191505092915050565b61053c81610621565b82525050565b600061054e8284610502565b915081905092915050565b600060208201905061056e6000830184610533565b92915050565b60006040820190506105896000830185610533565b818103602083015261059b81846104c9565b90509392505050565b60006105ae6105bf565b90506105ba828261069f565b919050565b6000604051905090565b600067ffffffffffffffff8211156105e4576105e36106ff565b5b6105ed82610742565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561065857808201518184015260208101905061063d565b83811115610667576000848401525b50505050565b6000600282049050600182168061068557607f821691505b60208210811415610699576106986106d0565b5b50919050565b6106a882610742565b810181811067ffffffffffffffff821117156106c7576106c66106ff565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61075c81610621565b811461076757600080fd5b5056fea2646970667358221220641dd1051dc3e865bd9494cae9d2e50efdffb336a64679ffadbc08bf66950e8364736f6c63430008070033",
    //     chainId: 1337,
    //   };
    //   const sentTxResponse = await wallet.sendTransaction(tx);
    //   await sentTxResponse.wait(1);
    //   console.log(sentTxResponse);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
