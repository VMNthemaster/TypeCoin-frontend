import React, {useContext, createContext} from "react";
import {useAddress, useContract, useMetamask} from '@thirdweb-dev/react'
import {ethers} from 'ethers'

const StateContext = createContext()

export const StateContextProvider = ({children}) => {
    const {contract} = useContract('0x59b6eB216eB6E251C05DD9883a71Db17b0E726Fa')    // contract address

    const address = useAddress()    // gives the address of the connected wallet
    const connect = useMetamask()

    const sendParticipationAmount = async () => {
        try {
            const data = await contract.call('receiveEthFromParticipant', {value: ethers.utils.parseEther('0.005')})
            // 0.005 is the participation amount in ethereum
            console.log("success",data)
            return data;
        } catch (error) {
            console.log("failed",error)
        }
    }

    const getSentences = async (_bool, _arr) => {
        try {
            const data = await contract.call('getSentence', _bool, _arr);
            console.log("success",data)
            return data;
        } catch (error) {
            console.log("failed",error)
        }
    }


    return (
        <StateContext.Provider value={{
            address,
            contract,
            connect,
            sendParticipationAmount,
            getSentences,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)