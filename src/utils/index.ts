type Row = string;
type List = Row[];

export const formatHex = (buffer: Buffer): string => {
  const stringReducer = (
    acc: string[],
    item: string,
    index: number,
    array: string[]
  ) => (index % 2 === 0 ? [...acc, item + array[index + 1]] : acc);

  const fromatReducer = (acc: List, item: string, index: number) => {
    const itemRow = Math.floor(index / 16) + 1;
    if (acc.length < itemRow) acc.push('');
    const isElementLastInRow = index === 15;
    const element = isElementLastInRow ? `${item}` : `${item}  `;
    acc[itemRow - 1] += element;
    return acc;
  };

  const string = buffer.toString('hex');
  const reducedString = string.split('').reduce(stringReducer, []);
  const formattedString = reducedString.reduce(fromatReducer, []);

  return formattedString.join('\n');
};
