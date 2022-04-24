/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const dropIndexValidation = ({
  data,
  count,
  dragIndex,
  dropIndex,
  isRowReorderValid,
  selectedGroup,
  selectedParent,
  nodePathSeparator,
  groupPathSeparator,
  allowRowReoderBetweenGroups,
  computedGroupBy,
  computedTreeEnabled,
  generateIdFromPath,
  enableTreeRowReorderParentChange,
}: {
  data: any[];
  count: number;
  dragIndex: number;
  dropIndex: number;
  isRowReorderValid: Function;
  selectedGroup: string[];
  selectedParent?: string;
  nodePathSeparator?: string;
  groupPathSeparator?: string;
  allowRowReoderBetweenGroups: boolean;
  computedGroupBy?: string[];
  computedTreeEnabled?: boolean;
  generateIdFromPath?: boolean;
  enableTreeRowReorderParentChange?: boolean;
}) => {
  let iterateRows = false;
  let validDropPositions = [];

  if (computedGroupBy && computedGroupBy.length > 0) {
    validDropPositions = data.reduce((acc: any[], curr: any, i: number) => {
      if (curr.__group) {
        const value = curr.keyPath.join(groupPathSeparator);
        if (!value.localeCompare(selectedGroup)) {
          iterateRows = true;
        } else {
          if (!allowRowReoderBetweenGroups) {
            iterateRows = false;
          }
        }
      }

      if (allowRowReoderBetweenGroups) {
        iterateRows = true;
      }

      if (!curr.__group && iterateRows) {
        acc[i] = true;
      } else {
        acc[i] = false;
      }

      return acc;
    }, {});
  } else if (computedTreeEnabled && generateIdFromPath) {
    validDropPositions = data.reduce((acc: any[], curr: any, i: number) => {
      const { leafNode, path } = curr.__nodeProps;

      if (!data[dragIndex].__nodeProps.leafNode) {
        acc[i] = false;
      } else {
        const parentNodeId = getParentNodeId(path, nodePathSeparator);
        const selectedParentNodeId = selectedParent
          ? getParentNodeId(selectedParent, nodePathSeparator)
          : '';

        if (!leafNode) {
          acc[i] = false;
        } else {
          if (enableTreeRowReorderParentChange) {
            acc[i] = true;
          } else {
            if (parentNodeId === selectedParentNodeId) {
              acc[i] = true;
            } else {
              acc[i] = false;
            }
          }
        }
      }

      return acc;
    }, {});
  } else {
    validDropPositions = [...Array(count)].reduce((acc, _curr, i) => {
      acc[i] = true;

      return acc;
    }, {});
    validDropPositions[count] = true;
  }

  if (isRowReorderValid) {
    validDropPositions[dropIndex] = isRowReorderValid({
      dragRowIndex: dragIndex,
      dropRowIndex: dropIndex,
    });
  }

  return validDropPositions;
};

const getParentNodeId = (path: string, pathSeparator?: string): string => {
  if (pathSeparator) {
    const parsedPath = path.split(pathSeparator);
    parsedPath.pop();

    const parentNodeId = parsedPath.join(pathSeparator);

    return parentNodeId;
  }

  return path;
};

export default dropIndexValidation;
