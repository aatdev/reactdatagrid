/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TypeConstrainRegion } from '../../types';

type DropIndexResultType = {
  index: number;
};

type DragBoxOffset = {
  top: number;
  left: number;
};

export default ({
  rowHeightManager,
  dragBoxInitialRegion,
  dragBoxOffsets,
  initialDiffTop,
  scrollTop,
  dragIndex,
  dir,
}: {
  rowHeightManager: any;
  dragBoxInitialRegion: TypeConstrainRegion;
  dragBoxOffsets: DragBoxOffset;
  initialDiffTop: number;
  scrollTop: number;
  dragIndex: number;
  dir: number;
}): DropIndexResultType => {
  const rowOffset =
    dragBoxInitialRegion.top - dragBoxOffsets.top + initialDiffTop + scrollTop;

  const currentIndex = rowHeightManager.getRowAt(rowOffset);

  if (currentIndex < 0) {
    return { index: -1 };
  }

  const nextRowIndex = currentIndex + dir;
  const nextRowHeight = rowHeightManager.getRowHeight(nextRowIndex);

  let nextRowOffset = rowHeightManager.getRowOffset(nextRowIndex);
  const halfSize = nextRowHeight / 2;

  if (nextRowOffset < 0) {
    nextRowOffset = 0;
  }

  let newDropIndex: number = -1;

  if (dir > 0) {
    if (rowOffset >= nextRowOffset - halfSize) {
      newDropIndex = nextRowIndex;
    }
  }

  if (dir < 0) {
    if (rowOffset > nextRowOffset + halfSize + nextRowHeight) {
      newDropIndex = currentIndex === dragIndex ? dragIndex : currentIndex + 1;
    } else {
      newDropIndex = currentIndex;
    }
  }

  if (newDropIndex === -1) {
    newDropIndex = currentIndex;
  }

  return { index: newDropIndex };
};
