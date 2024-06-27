//require() can be used in nodejs
//while in front-end js you need to use 'import' instead of require
import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undfined") {
        try {
            window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.error(error)
        }

        console.log("connected")
        document.getElementById("connectButton").innerHTML = "Connected!"
    } else {
        document.getElementById("connectButton").innerHTML =
            "Please install metamask!"
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undfined") {
        const prrovider = new ethers.providers.Web3Provider(window.ethereum)
        const singer = prrovider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, singer)

        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(txResponse, prrovider)
            console.log("done")
        } catch (error) {
            console.error(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undfined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undfined") {
        const prrovider = new ethers.providers.Web3Provider(window.ethereum)
        const singer = prrovider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, singer)

        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionMine(txResponse, prrovider)
        } catch (error) {
            console.error(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
