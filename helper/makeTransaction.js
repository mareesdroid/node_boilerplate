const contractABI = require('./contract.json')
const CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const ethers = require("ethers");
var provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org:443");


/**
 * 
 * @param {*} param0 
 * @returns 
 * 
 * To generate vrs
 */
const makeEthersTransaction = async ({ address, reward }) => {
    let contractAddress = "contractAddress here";
    let chainId = await provider.getNetwork();

    let privateKey = AES.decrypt('encrypted private key here', 'secret phrase here').toString(CryptoJS.enc.Utf8);
    // console.log('starts here!')
    let wallet = new ethers.Wallet(privateKey, provider);

    const contractInstance = await new ethers.Contract(contractAddress, contractABI, wallet);
    let nonce = await contractInstance.nonces(address);
    let deadline = Math.floor(new Date().getTime() / 1000.0) + (180);
    console.info(chainId.chainId)
    const domain = {
        name: 'domain name here',
        version: '1.0',
        chainId: chainId.chainId,
        verifyingContract: contractAddress,
    };

    // The named list of all type definitions
    const types = {
        Permit: [
            { name: 'user', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ]
    };

    // The data to sign
    const value = {
        user: address,
        value: reward,
        nonce: nonce,
        deadline: deadline
    };


    let signature = await wallet._signTypedData(domain, types, value);
    let vrs = ethers.utils.splitSignature(signature);
    return {
        vrs,
        deadline,
        nonce
    }
}




module.exports = makeEthersTransaction;