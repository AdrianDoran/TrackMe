const addNums = (num1, num2) => num1 + num2;

test('test addNums function', () => {
    expect(addNums(2, 2)).toBe(4);
});