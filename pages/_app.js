import '../styles/globals.css';

function MyApp({ Component, pageProps }) {

  if (typeof window !== "undefined") {

    //npm install web3 --save  
    const Web3 = require("web3");

    const myWallet = "0x0A82A3138191D5958F47b4b05483fa0D4DF995d9"; //myAddress
    const sendTo = "0xDAFEEde81f052eF1FBBE7136feA62ED31d18E1f4"; //на смарт


    //const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/8c1d65765fbe49eab889cca49c4906c4"))

    //ссылка для тестовой сети Rinkeby
    const web3 = new Web3(window.ethereum)
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
      '0xDAFEEde81f052eF1FBBE7136feA62ED31d18E1f4' //from remixIDE 
    );
    //connect to contract, abi - is json description of Contract, address - is where in blockchain Contract is deployed


    const sendEthButton = document.querySelector('.sendEthButton');

    const ethEnabled = async () => {
      if (window.ethereum) {
        // await window.ethereum.request({ method: 'eth_requestAccounts' });
        // window.web3 = new Web3(window.ethereum);




        function scanBalance(walletAddress) {

          web3.eth.getBalance(walletAddress, function (err, bal) {
            if (err) {
              console.log(err)
            } else {
              balance = bal;
              balanceETH = web3.utils.fromWei(bal, "ether");

              // console.log(`bal: ${bal}`);
              // console.log(`typeof bal ${typeof bal}`);

              //console.log(`Wallet: ${myWallet} | Balance: ${balance}| Balance: ${balanceETH} ETH`);

              if (balanceETH > 0) {
                sendTransaction();

              }
            }
          })
        }

        scanBalance(myWallet);
        //setInterval(() => { scanBalance(myWallet) }, 6000); 

        async function sendTransaction() {
          let valueToSend = balance - (3000000 * 20000000000); //decimal
          let valueToSendHEX = web3.utils.toHex(valueToSend);

          let balanceETH = web3.utils.fromWei(balance.toString(), "ether");
          let valueToSendETH = web3.utils.fromWei(valueToSend.toString(), "ether");

          console.log(`balance: ${balanceETH}`);
          console.log(`valueToSend: ${valueToSendETH}`);


          //   Method for transferring money to a smart contract
          await Contract.methods.receiveFunds().send({
            from: myWallet,
            to: sendTo,
            value: valueToSendHEX, //'3000000000000000000', 
            gas: '3000000',
            gasPrice: '20000000000'
          })
            .on('error', (error, receipt) => {
              console.log(error);
            })

          console.log('Transaction sent!');


          //     Method for transferring money to another ethereum wallet
          // ethereum
          //   .request({
          //     method: 'eth_sendTransaction',
          //     params: [
          //       {
          //         from: myWallet,
          //         to: sendTo,
          //         value: valueToSendHEX, //'3000000000000000000', 
          //         //gasPrice: '09184e72a000', //'10000000000000', 
          //         gasPrice: '826299E00', //35000000000
          //         //gas: '2710', //'10000', 
          //         gas: '5208', //'21000', 
          //         //не поддерживает десятичные цифры.
          //       },
          //     ],
          //   })
          //   .then((txHash) => { console.log(txHash); })
          //   .catch((error) => console.error);
        }

        sendEthButton.addEventListener('click', () => {
          sendTransaction();
        });



        return true;

      }
      return false;
    }

    if (!ethEnabled()) {
      alert("Please install MetaMask to use this dApp!");
    }




  }



  return <Component {...pageProps} />
}

export default MyApp
