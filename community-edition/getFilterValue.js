/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



import isFilterControlled from './isFilterControlled';

export default (props, state) => {
  return isFilterControlled(props) ? props.filterValue : state.filterValue;
};
