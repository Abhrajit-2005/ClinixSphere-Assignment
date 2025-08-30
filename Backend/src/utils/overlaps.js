// Check if two time ranges overlap
export const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
    return aStart < bEnd && bStart < aEnd;
};
