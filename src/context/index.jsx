import React, {useContext, createContext} from "react";
import {useAddress, useContract, useMetamask} from '@thirdweb-dev/react'
import {ethers} from 'ethers'

const StateContext = createContext()

export const StateContextProvider = ({children}) => {
    const {contract} = useContract('0x3a733129D0869029eee200AD2Ff59E351511BA84')    // contract address

    const address = useAddress()    // gives the address of the connected wallet
    const connect = useMetamask()

    const sendParticipationAmount = async () => {
        try {
            const data = await contract.call('receiveEthFromParticipant', {value: ethers.utils.parseEther('0.005')})
            // 0.005 is the participation amount in ethereum
            return {
                success: true,
                data,
            }
        } catch (error) {
            return {
                success: false,
                error,
            }
        }
    }

    const getSentences = async (_bool, _arr) => {
        try {
            const data = await contract.call('getSentence', _bool, _arr);
            return {
                success: true,
                data,
            }
        } catch (error) {
            return {
                success: false,
                error,
            }
        }
    }

    const getTotalNumberOfSentences = async () => {
        try {
            const num = await contract.call('getNumberOfSentences')
            return {
                success: true,
                num,
            }
        } catch (error) {
            return {
                success: false,
                error,
            }
        }
    }

    return (
        <StateContext.Provider value={{
            address,
            contract,
            connect,
            sendParticipationAmount,
            getSentences,
            getTotalNumberOfSentences,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)