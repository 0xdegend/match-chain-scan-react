import React, { useContext, useEffect, useState } from "react";
import transactionImage from "../../Assets/images/icon_transaction.png";
import blockImage from "../../Assets/images/icon_block.png";
import axios from "axios";
import { TranSactionsContext } from "../../Context/WalletContext";
import "./LiveBlock.css";
import { ethers } from "ethers";

const LiveBlock = () => {
  let [tranSactionLists, setTranSactionLists] = useState([]);
  let newWallet = localStorage.getItem("walletKey");
  const getTranList = async () => {
    try {
      let transactionList = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${newWallet}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${process.env.REACT_APP_API_KEY}`
      );
      localStorage.setItem(
        "transactionList",
        JSON.stringify(transactionList.data.result)
      );
      const transactionstoredList = localStorage.getItem("transactionList");
      const filteredList = JSON.parse(transactionstoredList);
      tranSactionLists = transactionList.data.result;
      //tranLists = filteredList;
      console.log(filteredList);
      if (filteredList === "Max rate limit reached") {
        alert("Max API Call/Sec limit reached");
        setTranSactionLists([]);
      } else if (Array.isArray(filteredList)) {
        setTranSactionLists(filteredList);
      } else {
        setTranSactionLists([]);
      }
      //setTranLists(tranLists);
      //console.log(JSON.parse(transactionstoredList));
    } catch (e) {
      console.error(e.message);
    }
  };
  useEffect(() => {
    if (newWallet) {
      getTranList();
    } else {
      // alert("Kindly Connect your wallet and Switch to Sepolia Network");
    }
  }, []);
  return (
    <div className="live-block-container">
      <div className="blocks-transaction">
        <div className="latest-block">
          <div className="image-text">
            <img src={blockImage} alt="" />
            <h5>Latest Blocks</h5>
          </div>
          <hr className="latest-block-hr" />
          {tranSactionLists.length < 1
            ? "No Blocks Mined Yet"
            : tranSactionLists?.map((transactionList) => (
                <div
                  className="blocks-details mined"
                  key={transactionList.blockNumber}
                >
                  <div className="block-box">
                    <img src={blockImage} alt="" className="block-box-image" />
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/block/${transactionList.blockNumber}`}
                    className="block-link"
                  >
                    {transactionList.blockNumber}
                  </a>
                  <a
                    href={`https://sepolia.etherscan.io/${newWallet}`}
                    className="block-mine-address"
                  >
                    {newWallet}
                  </a>
                </div>
              ))}
        </div>
        <div className="latest-transaction">
          <div className="image-text">
            <img src={transactionImage} alt="" />
            <h5>Latest Transactions</h5>
          </div>
          <hr className="latest-block-hr" />
          {tranSactionLists.length === 0
            ? "No Transaction Yet"
            : tranSactionLists.map((tranList) => (
                <>
                  <div className="blocks-details" key={tranList.blockNumber}>
                    <div className="block-box">
                      <img
                        src={transactionImage}
                        alt=""
                        className="block-box-image"
                      />
                    </div>
                    <a
                      href={`https://sepolia.etherscan.io/block/${tranList.blockNumber}`}
                      className="block-link"
                    >
                      {tranList.blockNumber}
                    </a>
                    <p></p>
                    <div className="address-to-from">
                      <p>From:</p>
                      <a
                        href={`https://sepolia.etherscan.io/address/${tranList.from}`}
                        className="block-address"
                      >
                        {tranList.from}
                      </a>
                      <p>To:</p>
                      <a
                        href={`https://sepolia.etherscan.io/address/${tranList.to}`}
                        className="block-address"
                      >
                        {tranList.to}
                      </a>
                    </div>
                    <span className="amount">
                      {ethers.utils.formatEther(tranList.value)}ETH
                    </span>
                  </div>
                </>
              ))}
        </div>
      </div>
    </div>
  );
};

export default LiveBlock;
