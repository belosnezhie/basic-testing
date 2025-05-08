import { random } from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

const initialBalance = 800;

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const newBankAccount = getBankAccount(initialBalance);

    expect(newBankAccount.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const newBankAccount = getBankAccount(initialBalance);

    expect(() => newBankAccount.withdraw(900)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const newBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);

    expect(() => newBankAccount.transfer(900, toBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const newBankAccount = getBankAccount(initialBalance);

    expect(() => newBankAccount.transfer(900, newBankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const newBankAccount = getBankAccount(initialBalance);
    newBankAccount.deposit(initialBalance);

    expect(newBankAccount.getBalance()).toStrictEqual(1600);
  });

  test('should withdraw money', () => {
    const newBankAccount = getBankAccount(initialBalance);
    newBankAccount.withdraw(initialBalance);

    expect(newBankAccount.getBalance()).toStrictEqual(0);
  });

  test('should transfer money', () => {
    const newBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);
    newBankAccount.transfer(400, toBankAccount);

    expect(newBankAccount.getBalance()).toStrictEqual(400);
    expect(toBankAccount.getBalance()).toStrictEqual(1200);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const newBankAccount = getBankAccount(initialBalance);

    const mockBalance = 1000;
    (random as jest.Mock).mockReturnValueOnce(mockBalance);
    (random as jest.Mock).mockReturnValueOnce(1);

    const res = await newBankAccount.fetchBalance();

    expect(random).toHaveBeenCalledTimes(2);
    expect(typeof res).toStrictEqual('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBankAccount = getBankAccount(initialBalance);

    const mockBalance = 1000;
    (random as jest.Mock).mockReturnValueOnce(mockBalance);
    (random as jest.Mock).mockReturnValueOnce(1);

    const balance = await newBankAccount.fetchBalance();

    expect(random).toHaveBeenCalledTimes(2);
    expect(balance).toBe(mockBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const newBankAccount = getBankAccount(initialBalance);

    const fetchBalanceSpy = jest.spyOn(newBankAccount, 'fetchBalance');
    fetchBalanceSpy.mockResolvedValue(null);

    await expect(() => newBankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
