import { IPaystackBank } from "../dto/IPaystackBank"
import {IPaystackResolveAccount } from "../dto/IPaystackResolveAccount";
import axios, { AxiosResponse } from "axios"

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
