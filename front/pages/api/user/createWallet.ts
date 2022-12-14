import axios from "axios";

const createWallet = (userWalletAddress: any, userPersonalKey: any) => {
  const Token = window.localStorage.getItem("AccessToken");

  const data = {
    userWalletAddress,
    userPersonalKey
  };

  return axios({
    url: `https://dog-hoogam.site/api/user-service/user/wallet`,
    method: "post",
    headers: { Authorization: `Bearer ${Token}` },
    data
  });
};

export default createWallet;
