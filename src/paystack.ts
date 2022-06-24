import { IPaystackBank } from "../dto/IPaystackBank"
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


