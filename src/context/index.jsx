import React, { useContext, createContext } from 'react'
import { useAddress, useContract, useMetamask } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
// import ContractABI from './abi.json'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  // const { ethereum } = window

  const contractAddress = '0x1C84F1262d53B6359E599490D24cbD28b6640c5c'
  const { contract } = useContract(contractAddress) // contract address

  const address = useAddress() // gives the address of the connected wallet
  const connect = useMetamask()

  const sendParticipationAmount = async () => {
    try {
      const data = await contract.call('receiveEthFromParticipant', {
        value: ethers.utils.parseEther('0.005'),
      })
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
      const data = await contract.call('getSentence', _bool, _arr)
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

  const sendWinningAmount = async () => {
    try {
      const data = await contract.call('sendEthToWinner')
      // 0.01 is the  is the winning amount in ethereum
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

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        sendParticipationAmount,
        getSentences,
        getTotalNumberOfSentences,
        sendWinningAmount,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
