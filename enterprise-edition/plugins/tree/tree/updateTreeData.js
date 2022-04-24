/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the Commercial License found in the
 * LICENSE file in the root directory of this source tree.
 */
const updateTreeDataIds = (data, config) => {
    const idProperty = config.idProperty;
    const nodesName = config.nodesName;
    const updateIds = (dataArr) => {
        for (let i = 0; i < dataArr.length; i++) {
            const item = dataArr[i];
            if (!item) {
                continue;
            }
            const itemNodes = item[nodesName];
            item[idProperty] = i + 1;
            if (Array.isArray(itemNodes)) {
                updateIds(itemNodes);
            }
        }
    };
    updateIds(data);
    return data;
};
const computeTreeData = (dataArray, config) => {
    const idProperty = config.idProperty;
    const nodesName = config.nodesName;
    const pathSeparator = config.pathSeparator;
    const expandedNodes = config.expandedNodes;
    const generateIdFromPath = config.generateIdFromPath;
    const selectedPath = config.selectedPath;
    const destinationPath = config.destinationPath;
    let value = [];
    let counter = 0;
    const computeData = (data, idSelected, destinationId, result = [], parentNode) => {
        let initialIdSelected = '';
        for (let i = 0; i < data.length; i++) {
            if (initialIdSelected === '') {
                initialIdSelected = idSelected;
            }
            if (counter === 2) {
                break;
            }
            const item = data[i];
            if (!item) {
                continue;
            }
            const itemId = `${item[idProperty]}`;
            const itemNodes = item[nodesName];
            const parentNodeId = parentNode ? `${parentNode[idProperty]}` : undefined;
            const path = parentNode
                ? `${parentNodeId}${pathSeparator}${item[idProperty]}`
                : `${item[idProperty]}`;
            if (generateIdFromPath) {
                item[idProperty] = path;
            }
            if (parentNode === undefined) {
                result.push(item);
            }
            else {
                const parentNodes = parentNode[nodesName];
                if (path === initialIdSelected) {
                    value.push(item);
                    parentNodes.splice(i, 1);
                    counter++;
                }
                if (path === destinationId) {
                    const nodeId = item[idProperty].split(pathSeparator);
                    const idInNodes = nodeId.splice(nodeId.length - 1, 1);
                    const index = parseInt(idInNodes);
                    parentNodes.splice(index, 0, value[0]);
                    counter++;
                }
            }
            if (expandedNodes && expandedNodes[itemId]) {
                if (Array.isArray(itemNodes)) {
                    computeData(itemNodes, idSelected, destinationId, result, item);
                }
            }
        }
        return result;
    };
    const computedData = computeData(dataArray, selectedPath, destinationPath);
    const updatedData = updateTreeDataIds(computedData, config);
    return updatedData;
};
const updateTreeData = (props, { selectedPath, destinationPath, }) => {
    const originalData = props.originalData || [];
    const config = {
        idProperty: props.idProperty,
        nodesName: props.nodesProperty,
        pathSeparator: props.nodePathSeparator,
        expandedNodes: props.computedExpandedNodes,
        generateIdFromPath: props.generateIdFromPath,
        selectedPath,
        destinationPath,
    };
    computeTreeData(originalData, config);
};
export default updateTreeData;
