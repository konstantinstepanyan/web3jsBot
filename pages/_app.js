import '../styles/globals.css';
//import './.env';
import DistributionJSON from './contracts/distribution.json';



function MyApp({ Component, pageProps }) {

  //npm install web3 --save  
  const Web3 = require("web3");

  const myWallet = "0x0A82A3138191D5958F47b4b05483fa0D4DF995d9"; //myAddress
  const sendTo = "0x679C8a1D8761571278D7830059b61f910Dc3f09c"; //на смарт



  //ссылка для основной сети
  //const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/8c1d65765fbe49eab889cca49c4906c4"))

  //ссылка для тестовой сети Rinkeby
  const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/8c1d65765fbe49eab889cca49c4906c4"))
  let balance = web3.eth.getBalance(myWallet);
  let balanceETH;


  const networkId = web3.eth.net.getId();


  const Contract = new web3.eth.Contract(
    [
      {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "receiveFunds",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    '0x679C8a1D8761571278D7830059b61f910Dc3f09c' //from remixIDE 
  );
  //connect to contract, abi - is json description of Contract, address - is where in blockchain Contract is deployed



  if (typeof window !== "undefined") {
    const sendEthButton = document.querySelector('.sendEthButton');
    console.log(sendEthButton)

    const ethEnabled = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        console.log('Metamask is Supported!')


        console.log(ethereum);

        return true;
      }
      return false;
    }

    if (!ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }


    function scanBalance(walletAddress) {

      web3.eth.getBalance(walletAddress, function (err, bal) {
        if (err) {
          console.log(err)
        } else {
          balance = bal;
          balanceETH = web3.utils.fromWei(bal, "ether");


          console.log(`Wallet: ${myWallet} | Balance: ${balance}| Balance: ${balanceETH} ETH`);

          if (balanceETH > 0) {
            sendTransaction();

          }
        }
      })
    }



    //изначально просканировать баланс
    scanBalance(myWallet);
    //setInterval(() => { scanBalance(myWallet) }, 6000); 


    function sendTransaction() {
      console.log(`balance: ${balance} wei`)
      let valueToSend = balance - (10000000000000 * 10000); //decimal
      console.log(`valueToSend: ${valueToSend} wei`)

      let valueToSendHEX = web3.utils.toHex(valueToSend);
      console.log(`valueToSendHEX: ${valueToSendHEX}`)

      ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: myWallet,
              to: sendTo,
              value: valueToSendHEX, //'3000000000000000000', 
              //gasPrice: '09184e72a000', //'10000000000000', 
              gasPrice: '826299E00', //35000000000
              //gas: '2710', //'10000', 
              gas: '5208', //'21000', 
              //не поддерживает десятичные цифры.
            },
          ],
        })
        .then((txHash) => { console.log(txHash); Contract.methods.withdrawFunds().send({ from: myWallet }); })
        .catch((error) => console.error);
    }

    sendEthButton.addEventListener('click', () => {
      sendTransaction();
    });



    function checkBalanceVal() {
      if (balance > 0) {
        console.log("Баланс больше 0");
        transfer();
      } else {
        console.log("Баланс меньше 0");
      }
    }

  }



  return <Component {...pageProps} />
}

export default MyApp
