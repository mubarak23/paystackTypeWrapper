export const getPaystackTransactionFeeMajor = (amonutmajor: number) => {
        let transferFee = (0.015 * amonutmajor)
        if(amonutmajor > 2500){
            transferFee += 100
        }
        return transferFee > 2000 ? 2000 : transferFee
} 