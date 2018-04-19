import * as React from 'react'

export type SelectionDirection = 'up' | 'down'

interface ISelectionAction {
  /**
   * The vertical direction use when searching for a selectable row.
   */
  readonly direction: SelectionDirection

  /**
   * The starting row index to search from.
   */
  readonly row: number

  /**
   * Whether or not to look beyond the last or first row
   * (depending on direction) such that given the last row and
   * a downward direction we'll consider the first row as a
   * candidate or given the first row and an upward direction
   * we'll consider the last row as a candidate.
   *
   * Defaults to true if not set.
   */
  readonly wrap?: boolean
}

<<<<<<< HEAD
/**
 * Interface describing a user initiated selection change event
 * originating from a pointer device clicking or pressing on an item.
 */
export interface IMouseClickSource {
  readonly kind: 'mouseclick'
  readonly event: React.MouseEvent<any>
}

/**
 * Interface describing a user initiated selection change event
 * originating from a pointer device hovering over an item.
 * Only applicable when selectedOnHover is set.
 */
export interface IHoverSource {
  readonly kind: 'hover'
  readonly event: React.MouseEvent<any>
}

/**
 * Interface describing a user initiated selection change event
 * originating from a keyboard
 */
export interface IKeyboardSource {
  readonly kind: 'keyboard'
  readonly event: React.KeyboardEvent<any>
}

/**
 * Interface describing a user initiated selection of all list
 * items (usually by clicking the Edit > Select all menu item in
 * the application window). This is highly specific to GitHub Desktop
 */
export interface ISelectAllSource {
  readonly kind: 'select-all'
}

/** A type union of possible sources of a selection changed event */
export type SelectionSource =
  | IMouseClickSource
  | IHoverSource
  | IKeyboardSource
  | ISelectAllSource

/**
 * Determine the next selectable row, provided the starting row and a direction to move.
 *
 * Returns null if no row can be selected.
 */
export function findNextSelectableRow(
  rowCount: number,
  action: ISelectionAction,
  canSelectRow: (row: number) => boolean = row => true
): number | null {
  if (rowCount === 0) {
    return null
  }

  const { direction, row } = action
  const wrap = action.wrap === undefined ? true : action.wrap

  // If we've been given a row that's out of bounds
  // we'll coerce it to a valid index starting either
  // at the bottom or the top depending on the direction.
  //
  // Given a row that would be below the last item and
  // an upward direction we'll pick the last selectable row
  // or the first selectable given an upward direction.
  //
  // Given a row that would be before the first item (-1)
  // and a downward direction we'll pick the first selectable
  // row or the first selectable given an upward direction.
  let currentRow =
    row < 0 || row >= rowCount ? (direction === 'up' ? rowCount - 1 : 0) : row

  const delta = direction === 'up' ? -1 : 1

  // Iterate through all rows (starting offset from the
  // given row and ending on and including the given row)
  for (let i = 0; i < rowCount; i++) {
    currentRow += delta

    if (currentRow >= rowCount) {
      // We've hit rock bottom, wrap around to the top
      // if we're allowed to or give up.
      if (wrap) {
        currentRow = 0
      } else {
        break
      }
    } else if (currentRow < 0) {
      // We've reached the top, wrap around to the bottom
      // if we're allowed to or give up
      if (wrap) {
        currentRow = rowCount - 1
      } else {
        break
      }
    }

    if (canSelectRow(currentRow) && row !== currentRow) {
      return currentRow
    }
  }

  return null
}