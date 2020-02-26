import * as faker from 'faker';
import { IPaymentMode } from '../models/organizational/payment.model';

const createPaymentMode = () => {
    const paymentMode: IPaymentMode = {
        shortDescription: faker.random.words(3),
        minAmount: faker.random.number(10),
        maxAmount: faker.random.number(20000)
    };
    return paymentMode;
}

export const generatePaymentModes = () => {
    let paymentModes: IPaymentMode[] = [];
    for(let i = 0; i <= 9; i++) {
        paymentModes.push(createPaymentMode());
    }
    return paymentModes;
}