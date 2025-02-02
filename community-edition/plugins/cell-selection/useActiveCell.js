/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useLayoutEffect, useCallback } from 'react';
import useProperty from '../../hooks/useProperty';
import clamp from '../../common/clamp';
import usePrevious from '../..//hooks/usePrevious';
import batchUpdate from '../../utils/batchUpdate';
const useActiveCell = (props, computedPropsRef) => {
    let [computedActiveCell, doSetActiveCell] = useProperty(props, 'activeCell');
    if (!props.enableKeyboardNavigation) {
        computedActiveCell = undefined;
    }
    const setActiveCell = useCallback((activeCell, queue) => {
        const computedProps = computedPropsRef.current;
        if (!computedProps || !computedProps.computedCellNavigationEnabled) {
            return;
        }
        const { computedActiveCell, data, visibleColumns } = computedProps;
        const shouldCommit = !queue;
        queue = queue || batchUpdate();
        if (activeCell) {
            let [activeCellRowIndex, activeCellColumnIndex] = activeCell;
            activeCellRowIndex = clamp(activeCellRowIndex, 0, data.length - 1);
            activeCellColumnIndex = clamp(activeCellColumnIndex, 0, visibleColumns.length - 1);
            const col = computedProps.getColumnBy(activeCellColumnIndex);
            if (col && col.cellSelectable === false) {
                return;
            }
            if (!data ||
                data.__group ||
                activeCellRowIndex == null ||
                activeCellColumnIndex == null) {
                queue(() => {
                    doSetActiveCell(null);
                    computedProps.setLastCellInRange('');
                });
                if (shouldCommit) {
                    queue.commit();
                }
                return;
            }
            activeCell = [activeCellRowIndex, activeCellColumnIndex];
            if (activeCell === computedActiveCell ||
                (computedActiveCell &&
                    activeCell &&
                    computedActiveCell[0] === activeCell[0] &&
                    computedActiveCell[1] === activeCell[1])) {
                return;
            }
        }
        queue(() => {
            doSetActiveCell(activeCell);
            computedProps.setLastCellInRange('');
        });
        if (shouldCommit) {
            queue.commit();
        }
    }, []);
    const oldActiveCell = usePrevious(computedActiveCell, null);
    useLayoutEffect(() => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        if (oldActiveCell !== computedActiveCell && computedActiveCell) {
            const [rowIndex, columnIndex] = computedActiveCell;
            if (rowIndex == null || columnIndex == null) {
                return;
            }
            const top = !oldActiveCell || rowIndex < oldActiveCell[0];
            const right = !oldActiveCell || columnIndex > oldActiveCell[1];
            const scrollToColumnIndex = clamp(columnIndex + (right ? 0 : -0), 0, computedProps.visibleColumns.length - 1);
            computedProps.scrollToCell({ rowIndex, columnIndex: scrollToColumnIndex }, { top, right });
        }
    }, [computedActiveCell, oldActiveCell]);
    const getCellSelectionBetween = useCallback((start, end) => {
        const { current: computedProps } = computedPropsRef;
        if (!start || !end || !computedProps) {
            return {};
        }
        const startRow = Math.min(start[0], end[0]);
        const startCol = Math.min(start[1], end[1]);
        const endRow = Math.max(start[0], end[0]);
        const endCol = Math.max(start[1], end[1]);
        const range = {};
        const groupBy = computedProps.computedGroupBy;
        const dataSource = groupBy ? computedProps.data : [];
        let current;
        for (let row = startRow; row <= endRow; row++) {
            if (groupBy) {
                current = dataSource[row];
                if (!current) {
                    break;
                }
                if (current.__group) {
                    continue;
                }
            }
            for (let col = startCol; col <= endCol; col++) {
                range[getCellSelectionKey(row, col)] = true;
            }
        }
        return range;
    }, []);
    const getCellSelectionKey = useCallback((cellProps, col) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return -1;
        }
        let rowKey;
        let colKey;
        if (typeof cellProps === 'string') {
            return cellProps;
        }
        if (typeof cellProps === 'number' && typeof col === 'number') {
            rowKey = cellProps;
            colKey = col;
        }
        else {
            if (cellProps) {
                rowKey = cellProps.rowIndex;
                colKey = cellProps.columnIndex;
            }
        }
        if (!computedProps.cellSelectionByIndex) {
            return computedProps.getCellSelectionIdKey(rowKey, colKey);
        }
        return `${[rowKey, colKey]}`;
    }, [computedPropsRef, props.columns]);
    const getCellSelectionIdKey = useCallback((rowIndex, columnIndex) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return -1;
        }
        const col = computedProps.getColumnBy(columnIndex);
        if (!col) {
            return -1;
        }
        const colId = col.id || col.name;
        const item = computedProps.getItemAt(rowIndex);
        if (!item) {
            return '';
        }
        const rowId = computedProps.getItemId(item);
        return `${[rowId, colId]}`;
    }, []);
    const incrementActiveCell = useCallback((direction) => {
        const { current: computedProps } = computedPropsRef;
        if (!computedProps) {
            return;
        }
        let { computedActiveCell } = computedProps;
        if (!computedActiveCell) {
            computedActiveCell = [0, 0];
        }
        const [row, col] = direction;
        const { data, visibleColumns, computedGroupBy, groupColumn, } = computedProps;
        const maxRow = data.length - 1;
        const columns = visibleColumns;
        const maxCol = columns.length - 1;
        const groupBy = computedGroupBy;
        const minCol = groupBy && !groupColumn ? groupBy.length : 0;
        let rowIndex = computedActiveCell[0];
        let colIndex = computedActiveCell[1];
        if (row) {
            const rowSign = row < 0 ? -1 : 1;
            let rowAdd = row;
            while (data[rowIndex + rowAdd] && data[rowIndex + rowAdd].__group) {
                rowIndex += rowAdd;
                rowAdd = rowSign;
            }
            rowIndex += rowAdd;
        }
        if (col) {
            const colSign = col < 0 ? -1 : 1;
            let colAdd = col;
            while (columns[colIndex + colAdd] &&
                columns[colIndex + colAdd].cellSelectable === false) {
                colIndex += colSign;
                colAdd = colSign;
            }
            colIndex += colAdd;
        }
        rowIndex = clamp(rowIndex, 0, maxRow);
        colIndex = clamp(colIndex, minCol, maxCol);
        computedProps.setActiveCell([rowIndex, colIndex]);
    }, []);
    return {
        getCellSelectionBetween,
        getCellSelectionIdKey,
        computedActiveCell,
        setActiveCell,
        getCellSelectionKey,
        incrementActiveCell,
    };
};
export default useActiveCell;
