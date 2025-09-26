import React, { useContext, useEffect, useState, useCallback } from "react";
import transactionImage from "../../Assets/images/icon_transaction.png";
import blockImage from "../../Assets/images/icon_block.png";
import axios from "axios";
import { TranSactionsContext } from "../../Context/WalletContext";
import "./LiveBlock.css";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

const LiveBlock = () => {
  const [tranSactionLists, setTranSactionLists] = useState([]);
  // const [walletKey, setWalletKey] = useState(localStorage.getItem("walletKey"));
  const { address } = useAccount();
  const { user } = usePrivy();
  const getTranList = useCallback(async (wallet) => {
    if (!wallet) {
      setTranSactionLists([]);
      return;
    }
    try {
      let response = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=5&sort=asc&apikey=${process.env.REACT_APP_API_KEY}`
      );
      const data = response.data;
      if (data.message && data.message.toLowerCase().includes("rate limit")) {
        alert("Max API Call/Sec limit reached");
        setTranSactionLists([]);
        return;
      }
      if (Array.isArray(data.result)) {
        setTranSactionLists(data.result);
      } else {
        setTranSactionLists([]);
      }
    } catch (e) {
      console.error(e.message);
      setTranSactionLists([]);
    }
  }, []);

  useEffect(() => {
    if (user && address) {
      getTranList(address);
    } else {
      setTranSactionLists([]);
    }
  }, [user, address, getTranList]);

  return (
    <div className="live-block-container">
      <div className="blocks-transaction">
        <div className="latest-block">
          <div className="image-text">
            <img src={blockImage} alt="" />
            <h5>Latest Blocks</h5>
          </div>
          <hr className="latest-block-hr" />
          {!user || !address
            ? "Connect your wallet to view blocks."
            : tranSactionLists.length < 1
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
                    href={`https://sepolia.etherscan.io/${address}`}
                    className="block-mine-address"
                  >
                    {address}
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
          {!user || !address
            ? "Connect your wallet to view transactions."
            : tranSactionLists.length === 0
            ? "No Transaction Yet"
            : tranSactionLists.map((tranList) => (
                <div
                  className="blocks-details"
                  key={tranList.hash || tranList.blockNumber}
                >
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
              ))}
        </div>
      </div>
    </div>
  );
};

export default LiveBlock;
