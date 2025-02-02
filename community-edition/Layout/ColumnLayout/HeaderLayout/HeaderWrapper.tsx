/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import getScrollbarWidth from '../../../packages/getScrollbarWidth';

import Header from './Header';

const fixScrollLeft = (event: any) => {
  const target = event.currentTarget;

  requestAnimationFrame(() => {
    if (target.scrollLeft) {
      target.scrollLeft = 0;
    }
  });
};

export default class HeaderWrapper extends React.Component<any> {
  getSortedColumnsInfo = ({ computedSortInfo, columnsMap }: any) => {
    if (!computedSortInfo) {
      return;
    }

    let sortedColumnsInfo: any[] = [];
    if (Array.isArray(computedSortInfo)) {
      computedSortInfo.map(sortInfo => {
        sortedColumnsInfo.push(columnsMap[sortInfo.name]);
      });
    } else {
      return columnsMap[computedSortInfo.name];
    }

    return sortedColumnsInfo;
  };

  render() {
    const { props } = this;
    const {
      data,
      deselectAll,
      computedShowHeaderBorderRight,
      headerProps,
      filterTypes,
      filterable,
      isMultiSort,
      nativeScroll,
      resizable,
      resizeProxyStyle,
      scrollLeft,
      scrollbars,
      selectAll,
      computedSelected: selected,
      computedUnselected: unselected,
      computedSelectedCount: selectedCount,
      sortInfo,
      sortable,
      renderSortTool,
      paginationCount: totalCount,
      computedUnselectedCount: unselectedCount,
      virtualListBorderLeft,
      virtualListBorderRight,
      visibleColumns: columns,
      lastLockedStartIndex,
      lastLockedEndIndex,
      lastUnlockedIndex,
      updateLockedWrapperPositions,
      theme,
      columnWidthPrefixSums,
      renderMenuTool,
      computedSortInfo,
      columnsMap,
      columnIndexHovered,
      onColumnMouseEnter,
      onColumnMouseLeave,
      columnHoverClassName,
      enableColumnFilterContextMenu,
      computedEnableColumnHover,
      renderRowDetailsMoreIcon,
      hideColumnContextMenu,
      updateMenuPosition,
    } = props;

    let scrollbarWidth = 0;

    if (nativeScroll && scrollbars.vertical) {
      scrollbarWidth = getScrollbarWidth();
    }

    const sortedColumnsInfo = this.getSortedColumnsInfo({
      computedSortInfo,
      columnsMap,
    });

    const headerHeight = !props.computedGroups ? props.headerHeight : undefined;

    return (
      <div
        className={`InovuaReactDataGrid__header-wrapper InovuaReactDataGrid__header-wrapper--direction-${
          this.props.rtl ? 'rtl' : 'ltr'
        }`}
        onFocus={fixScrollLeft}
      >
        {nativeScroll && this.props.rtl ? (
          <div
            className="InovuaReactDataGrid__header-rtl-scroll-spacer"
            style={{
              minWidth: scrollbarWidth,
              display: scrollbarWidth ? 'block' : 'none',
            }}
          />
        ) : null}
        <Header
          {...headerProps}
          setScrollLeft={props.setScrollLeft}
          getScrollLeftMax={props.getScrollLeftMax}
          availableWidth={props.availableWidth}
          lockedRows={props.lockedRows}
          rtl={props.rtl}
          i18n={props.i18n}
          lastLockedStartIndex={lastLockedStartIndex}
          lastLockedEndIndex={lastLockedEndIndex}
          lastUnlockedIndex={lastUnlockedIndex}
          columnHeaderUserSelect={props.columnHeaderUserSelect}
          columnRenderCount={props.columnRenderCount}
          columnResizeHandleWidth={props.columnResizeHandleWidth}
          columnUserSelect={props.columnUserSelect}
          renderInPortal={props.renderInPortal}
          columns={columns}
          columnsMap={props.columnsMap}
          data={data}
          filterTypes={filterTypes}
          showColumnMenuTool={props.showColumnMenuTool}
          showColumnMenuToolOnHover={props.showColumnMenuToolOnHover}
          deselectAll={deselectAll}
          firstLockedEndIndex={props.firstLockedEndIndex}
          firstUnlockedIndex={props.firstUnlockedIndex}
          computedGroupsMap={props.computedGroupsMap}
          computedGroupsDepth={props.computedGroupsDepth}
          onColumnHeaderFocus={props.onColumnHeaderFocus}
          filterable={filterable}
          showColumnContextMenu={props.showColumnContextMenu}
          showColumnFilterContextMenu={props.showColumnFilterContextMenu}
          hideColumnFilterContextMenu={props.hideColumnFilterContextMenu}
          computedShowHeaderBorderRight={computedShowHeaderBorderRight}
          hasLockedEnd={props.hasLockedEnd}
          hasLockedStart={props.hasLockedStart}
          headerHeight={headerHeight}
          isMultiSort={isMultiSort}
          lockedEndColumns={props.lockedEndColumns}
          lockedStartColumns={props.lockedStartColumns}
          minWidth={props.minRowWidth}
          nativeScroll={nativeScroll}
          onCellClick={props.onHeaderCellClick}
          onGroupMouseDown={props.onHeaderGroupMouseDown}
          onCellMouseDown={props.onHeaderCellMouseDown}
          onCellTouchStart={props.onHeaderCellTouchStart}
          onResizeMouseDown={props.onResizeMouseDown}
          onResizeTouchStart={props.onResizeTouchStart}
          onSortClick={props.onHeaderSortClick}
          onTransitionEnd={props.onTransitionEnd}
          ref={props.refHeader}
          renderSortTool={renderSortTool}
          resizable={resizable}
          resizeProxyStyle={resizeProxyStyle}
          scrollLeft={scrollLeft}
          scrollbarWidth={scrollbarWidth}
          selectAll={selectAll}
          selectedCount={selectedCount}
          selected={selected}
          unselected={unselected}
          sortInfo={sortInfo}
          sortable={sortable}
          totalCount={totalCount}
          theme={theme}
          renderLockedStartCells={props.renderLockedStartCells}
          renderLockedEndCells={props.renderLockedEndCells}
          onFilterValueChange={props.onFilterValueChange}
          unselectedCount={unselectedCount}
          virtualListBorderLeft={virtualListBorderLeft}
          virtualListBorderRight={virtualListBorderRight}
          updateLockedWrapperPositions={updateLockedWrapperPositions}
          virtualizeColumns={
            props.virtualizeColumns && !!headerHeight && !props.computedGroups
          }
          columnWidthPrefixSums={columnWidthPrefixSums}
          renderMenuTool={renderMenuTool}
          sortedColumnsInfo={sortedColumnsInfo}
          columnIndexHovered={columnIndexHovered}
          onColumnMouseEnter={onColumnMouseEnter}
          onColumnMouseLeave={onColumnMouseLeave}
          columnHoverClassName={columnHoverClassName}
          enableColumnFilterContextMenu={enableColumnFilterContextMenu}
          computedEnableColumnHover={computedEnableColumnHover}
          renderRowDetailsMoreIcon={renderRowDetailsMoreIcon}
          hideColumnContextMenu={hideColumnContextMenu}
          updateMenuPosition={updateMenuPosition}
          computedFilterable={props.computedFilterable}
          filterRowHeight={props.filterRowHeight}
        />
        <div className="InovuaReactDataGrid__header-wrapper__fill">
          {props.computedFilterable && (
            <div className="InovuaReactDataGrid__header-wrapper__fill__filters" />
          )}
        </div>
      </div>
    );
  }
}

(HeaderWrapper as any).propTypes = {
  visibleColumns: PropTypes.array.isRequired,
  columnsMap: PropTypes.object.isRequired,
  deselectAll: PropTypes.func,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  headerProps: PropTypes.object,
  isMultiSort: PropTypes.bool,
  refHeader: PropTypes.func.isRequired,
  selectAll: PropTypes.func,
  setScrollLeft: PropTypes.func,
  sortable: PropTypes.bool,
  virtualizeColumns: PropTypes.bool,
  updateLockedWrapperPositions: PropTypes.func,
  lastLockedStartIndex: PropTypes.number,
  lastLockedEndIndex: PropTypes.number,
  lastUnlockedIndex: PropTypes.number,
  computedEnableColumnHover: PropTypes.bool,
  renderRowDetailsMoreIcon: PropTypes.func,
  computedFilterable: PropTypes.bool,
  filterRowHeight: PropTypes.number,
};
