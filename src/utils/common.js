export const binarySearch = (
  array,
  start = 0,
  end = array.length,
  searchedItem
) => {
  if (end >= start) {
    const middle = Math.floor(start + (end - start) / 2);
    const currItem = array[middle].rowId;
    if (searchedItem === currItem) {
      return searchedItem;
    }

    if (searchedItem < currItem) {
      return binarySearch(array, start, middle - 1, searchedItem);
    } else {
      return binarySearch(array, middle + 1, end, searchedItem);
    }
  }

  return -1;
};
