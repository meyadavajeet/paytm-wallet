import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import constants from "../config/constants";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    try {
      axios
        .get(`${constants.SERVER_URL}api/v1/account/balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setBalance(response.data.balance);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
