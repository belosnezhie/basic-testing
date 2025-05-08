import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const data = [
    { id: '2', value: 'one' },
    { id: '2', value: 'two' },
    { id: '3', value: 'three' },
  ];

  test('should generate linked list from values 1', () => {
    const res = generateLinkedList(data);
    const expected = {
      value: {
        id: '2',
        value: 'one',
      },
      next: {
        value: {
          id: '2',
          value: 'two',
        },
        next: {
          value: {
            id: '3',
            value: 'three',
          },
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(res).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const res = generateLinkedList(data);
    expect(res).toMatchSnapshot();
  });
});
