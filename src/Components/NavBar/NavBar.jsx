import React, { useState, useContext, useEffect } from "react";
import matchLabs from "../../Assets/images/match_logo.svg";
import "./NavBar.css";
import { useAccount } from "wagmi";
import { useLogin, usePrivy, useLogout } from "@privy-io/react-auth";
const NavBar = () => {
  // let [wallet, setWallet] = useContext(WalletContext);
  const { ready, authenticated, user } = usePrivy();
  const { address } = useAccount();
  const { login } = useLogin({
    onComplete: ({
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    }) => {
      console.log("User logged in successfully", user);
      console.log("Is new user:", isNewUser);
      console.log("Was already authenticated:", wasAlreadyAuthenticated);
      console.log("Login method:", loginMethod);
      console.log("Login account:", loginAccount);
      // Navigate to dashboard, show welcome message, etc.
    },
    onError: (error) => {
      console.error("Login failed", error);
      // Show error message
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      // setUserAddress("");
      console.log("User logged out");
    },
  });

  // let newWallet = localStorage.getItem("walletKey");
  // let [mainBalance, setBalance] = useContext(WalletContext);
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  //let [chainID, setChainID] = useState();
  //const chainID = 11155111;
  // const connectWallet = async (e) => {
  //   e.preventDefault();
  //   const accounts = await provider.send("eth_requestAccounts", []);
  //   const balance = await provider.getBalance(accounts[0]);
  //   const balanceInEther = ethers.utils.formatEther(balance);
  //   mainBalance = balanceInEther;
  //   wallet = localStorage.setItem("walletKey", accounts[0]);
  //   setWallet(wallet);
  //   window.location.reload();
  // };

  // const disConnect = () => {
  //   localStorage.removeItem("walletKey");
  //   localStorage.removeItem("transactionList");
  //   window.location.reload();
  // };
  return (
    <>
      <header className="header-container">
        <nav className="nav-items">
          <div className="logo">
            <a href="##">
              <img src={matchLabs} alt="" />
            </a>
          </div>
          <ul className="nav-list">
            <li className="desktop">
              <a href="##">Blockchain</a>
            </li>
            <li className="desktop">
              <a href="##">Tokens</a>
            </li>
            <li className="desktop">
              <a href="##">APIs</a>
            </li>
            <li>
              <div className="circle-container">
                <div className={user ? "circle green" : "circle red"}></div>
                {/* <a href="##">{user ? "Connected" : "Not Connected"}</a> */}
                <a href="##" className="disconnect" onClick={logout}>
                  {user ? "Disconnect" : ""}
                </a>
                {user ? <></> : <button onClick={login}>Connect Wallet</button>}
              </div>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default NavBar;
