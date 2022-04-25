import '../styles/globals.css';
import React, { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {


  if (typeof window !== "undefined") {
    //const intervalForScan = 300000; //5min (а надо минимум 30 мин)
    const intervalForScan = 20000; //20secs cuz setInterval works only when site is active

    const Web3 = require("web3");
    const metamask = new Web3(window.ethereum)

    const myWallet = "0x0A82A3138191D5958F47b4b05483fa0D4DF995d9"; //myAddress

    const wallet_95per = "0x06248eC763aA1AAC3e02ff82E474364770Ef3764"; //receipt wallet
    const wallet_5per = "0xA0186C212E51Fb0fBc236aD9679A45B295Bd2ADB"; //my wallet


    let balance = metamask.eth.getBalance(myWallet);
    //баланс берется с адреса кошелька и с сети, к которой он в данный момент подключен. Rinkeby, Polygon и т.д.
    let balanceETH;

    const networkId = metamask.eth.net.getId();


    const sendEthButton = document.querySelector('.sendEthButton');

    const ethEnabled = async () => {
      if (window.ethereum) {
        // await window.ethereum.request({ method: 'eth_requestAccounts' });
        // window.metamask = new Web3(window.ethereum);




        function scanBalance(walletAddress) {

          metamask.eth.getBalance(walletAddress, function (err, bal) {
            if (err) {
              console.log(err)
            } else {
              balance = bal;
              balanceETH = metamask.utils.fromWei(bal.toString(), "ether");
              console.log(`Wallet Balance: ${balanceETH} ETH`)

              if (balanceETH > 0) {
                sendTransaction();

              }
            }
          })
        }

        scanBalance(myWallet);
        //setInterval(() => { scanBalance(myWallet) }, intervalForScan);

        async function sendTransaction() {

          let fastGasPrice_WEI;
          let fastGasPrice_ETH;

          await fetch(
            'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken',
            { method: 'GET' }
          )
            .then(response => response.json())
            .then(data => {
              fastGasPrice_WEI = metamask.utils.toWei(data.result.FastGasPrice.toString(), "gwei");
              fastGasPrice_ETH = metamask.utils.fromWei(fastGasPrice_WEI.toString(), "ether");
            })
            .catch(error => { console.error('error:', error); });

          //

          let transactions;
          const order = 'desc'; //asc - по возрастанию, desc - по убыванию
          //YourApiKeyToken - нужно вставить ключ, без него не выдаёт транзакции
          //all transaction API
          await fetch(
            //`https://api.etherscan.io/api?module=account&action=txlist&address=${myWallet}&startblock=0&endblock=99999999&page=${1}&offset=${10}&sort=${order}&apikey=F7GWSWHCFJ7TQRUXJXE4GG68T4C29C2YPN`,
            `https://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&page=${1}&offset=${20}&sort=${order}&apikey=F7GWSWHCFJ7TQRUXJXE4GG68T4C29C2YPN`,
            { method: 'GET' }
          )
            .then(response => response.json())
            .then(data => {
              transactions = data.result;

            })
            .catch(error => { console.error('error:', error); });
          //

          for (let i of transactions) {
            console.log(`TRANSACTION`
              + '\n' + `blockNumber: ${i.blockNumber},`
              + '\n' + `txn hash: ${i.hash},`
              + '\n' + `from: ${i.from},`
              + '\n' + `to: ${i.to},`
              //+ '\n' + `value: ${i.value} WEI`
              + '\n' + `value: ${metamask.utils.fromWei(i.value.toString(), "ether")} ETH,`
              + '\n' + 'END')
          }

          //



          const gasVal = 30000; //units
          const gasPriceVal_1 = fastGasPrice_WEI || 250000000000; //price of each gas unit

          //console.log(`gasPriceVal_11: ${gasPriceVal_1}`)


          const gasFee_1 = gasVal * gasPriceVal_1; //total gas fee

          const fee = 15000000000000000; //0.015 ETH

          let valueToSend = balance - gasFee_1 - fee; //decimal
          //let valueToSend = 1000000000000000000; //1eth

          let valueToSend_95 = (valueToSend / 100) * 95; //95%
          let valueToSend_5 = (valueToSend / 100) * 5; //5%

          //console.log(`valueToSend_95 eth: ${metamask.utils.fromWei(valueToSend_95.toString(), "ether")}`);
          //console.log(`valueToSend_5 eth: ${metamask.utils.fromWei(valueToSend_5.toString(), "ether")}`);

          let valueToSendHEX_95per = metamask.utils.toHex(valueToSend_95);
          let valueToSendHEX_5per = metamask.utils.toHex(valueToSend_5);

          let gasPriceHEX_1 = metamask.utils.toHex(gasPriceVal_1).toString();
          let gasHEX = metamask.utils.toHex(gasVal).toString();



          await transfer(myWallet, wallet_95per, valueToSendHEX_95per, gasHEX, gasPriceHEX_1);
          await transfer(myWallet, wallet_5per, valueToSendHEX_5per, gasHEX, gasPriceHEX_1);

          //console.log(`transactions for wallets. gasFee_1: ${metamask.utils.fromWei(gasFee_1.toString(), "ether")} ETH`);



          function transfer(from, to, valueToSend, gas, gasPrice) {

            ethereum
              .request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: from,
                    to: to,
                    value: valueToSend,
                    gasPrice: gasPrice,
                    //gasPrice: '826299E00', //35000000000
                    gas: gas,
                    //gas: '5208', //'21000', 
                    //не поддерживает десятичные цифры.
                  },
                ],
              })
              .then((txHash) => { console.log(txHash); })
              .then(() => console.log('Transaction sent!'))
              .catch((error) => console.error);
          }
          //     Method for transferring money to another ethereum wallet

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

// MyApp.getInitialProps = async (ctx) => {
//   // Get user id
//   console.log('getInitiaLProps')
//   return {

//   }
// }

export default MyApp
