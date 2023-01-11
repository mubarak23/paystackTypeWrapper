import { IUser } from "./IUser";

// IPaymentInitializeRequest
export interface IPaymentInitializeRequest  {
    amountMajor: number,
    payingUser: IUser
}