import { getBankAccount, InsufficientFundsError, TransferFailedError } from '.';

const initialBalance = 800;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const newBankAccount = getBankAccount(initialBalance);

    expect(newBankAccount.getBalance()).toEqual(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const newBankAccount = getBankAccount(initialBalance);
    const error = new InsufficientFundsError(initialBalance);

    expect(() => newBankAccount.withdraw(900)).toThrow(error);
  });

  test('should throw error when transferring more than balance', () => {
    const newBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);
    const error = new InsufficientFundsError(initialBalance);

    expect(() => newBankAccount.transfer(900, toBankAccount)).toThrow(error);
  });

  test('should throw error when transferring to the same account', () => {
    const newBankAccount = getBankAccount(initialBalance);
    const error = new TransferFailedError();

    expect(() => newBankAccount.transfer(900, newBankAccount)).toThrow(error);
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
    // Write your tests here
  });

  test('should set new balance if fetchBalance returned number', async () => {
    // Write your tests here
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    // Write your tests here
  });
});
