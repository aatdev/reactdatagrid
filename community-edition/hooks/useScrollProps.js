/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import getScrollbarWidth from '../packages/getScrollbarWidth';
import { useMemo } from 'react';
export default (props, computedProps) => {
    const SCROLLBAR_WIDTH = useMemo(() => getScrollbarWidth(), []);
    const scrollProps = {
        scrollMaxDelta: SCROLLBAR_WIDTH ? 1 : 1,
        //, it was 0 when !SCROLLBAR_WIDTH, but with some zoom levels it didn't work as chrome fails calculating properly due to float rounding issues
        scrollDebounceDelay: 1,
        // that's why we also had to add scrollDebounceDelay to be 1
        // in order not to load multiple pages on livepagination scrolltobottom reached
        ...props.scrollProps,
    };
    if (computedProps.livePagination) {
        const loadNextPage = () => {
            if (!computedProps.computedLoading && computedProps.gotoNextPage) {
                computedProps.gotoNextPage({ append: true });
            }
        };
        scrollProps.onContainerScrollVerticalMax = (...args) => {
            if (props.scrollProps && props.scrollProps.onContainerScrollVerticalMax) {
                props.scrollProps.onContainerScrollVerticalMax(...args);
            }
            loadNextPage();
        };
    }
    return scrollProps;
};
