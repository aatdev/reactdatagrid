/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useClipboard } from './useClipboard';
const clipboard = {
    name: 'clipboard',
    hook: useClipboard,
    defaultProps: () => {
        return {};
    },
};
export default clipboard;
