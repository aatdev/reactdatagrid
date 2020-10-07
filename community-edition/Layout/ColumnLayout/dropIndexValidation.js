/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default ({ count, dragIndex, dropIndex, isRowReorderValid, }) => {
    let validDropPositions = [...Array(count)].reduce((acc, curr, i) => {
        acc[i] = true;
        return acc;
    }, {});
    validDropPositions[count] = true;
    if (isRowReorderValid) {
        validDropPositions[dropIndex] = isRowReorderValid({
            dragRowIndex: dragIndex,
            dropRowIndex: dropIndex,
        });
    }
    return validDropPositions;
};
