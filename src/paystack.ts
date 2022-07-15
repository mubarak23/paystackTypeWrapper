import { IPaystackBank } from "../dto/IPaystackBank"
import {IPaystackResolveAccount } from "../dto/IPaystackResolveAccount";
import axios, { AxiosResponse } from "axios"
import { IUser } from "../dto/IUser";
import { IPaymentInitializeResponse } from "../dto/IPaymentInitializepresonse";
import * as Util from "./helper"

export const getBankLists = async (country: string): Promise<IPaystackBank[]> => {
    const baseUrl = process.env.PAYSTACK_BASE_URL + `/bank/?country=${country}`
    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'content-type': 'application/json',
        'cache-control': 'no-cache'
    }
   try {
       const response: AxiosResponse<any> = await axios.get(baseUrl, {headers})
       if( !response.data && response.status !== 200 ){
        throw new Error('An error occurred with our third party. Please try again at a later time.')
       } 
     const paystackBanks: IPaystackBank[] = response.data.data 
     return paystackBanks 
   } catch (e) {
    throw new Error('An error occurred with our third party. Please try again at a later time.')
   } 

} 

export const accountNmeEnqury = async (bankCode: string, accountNumber: string): Promise<IPaystackResolveAccount> => {
    const baseURL =  process.env.PAYSTACK_BASE_URL + `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'content-type': 'application/json',
    'cache-control': 'no-cache'
  }
  try{
    const response: AxiosResponse<any> = await axios.get(baseURL, { headers })
    if(!response.data && response.status !== 200){
        throw new Error('An error occurred with our third party. Please try again at a later time.')
    }
    const payStackResolveAccount : IPaystackResolveAccount = response.data.data
    return payStackResolveAccount
  }catch(e){
    throw new Error('An error occurred with our third party. Please try again at a later time.')
  }
}


export const initializeTransaction = async (payingUser:IUser, amountMajor: number): Promise<IPaymentInitializeResponse> => {
    const base_url = process.env.PAYSTACK_BASE_URL + `/transaction/initialize`
    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache'
    }
    const amountMinor = (amountMajor || 0) * 100
    try{
      const transactionFeeMajor = Util.getPaystackTransactionFeeMajor(amountMajor)
      const payload: any = {
        amount: ((amountMajor || 0) * 100) + (transactionFeeMajor * 100),
        email: payingUser.email,
        metadata: {
          full_name: `${payingUser.firstName} ${payingUser.lastName}`
        }
      }

      const response: AxiosResponse<any> = await axios.post(base_url, payload, {
        headers
      })

      if(!response.data && response.status !== 200){
        throw new Error('An error occurred with our third party. Please try again at a later time.')
    }
      const { authorization_url, reference, access_code } = response.data.data
      return {
        paymentProviderRedirectUrl: authorization_url,
        paymentReference: reference,
        accessCode: access_code
      }
    }catch(e){
      console.log(`e message`, e.message)
      console.log(e.stack)
      throw new Error('An error occurred with our payment provider. Please try again at a later time.')
    }
}
