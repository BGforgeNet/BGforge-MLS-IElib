/** 
 * Direction: 0-15, clockwise from S.
 * - Dir.ids exists only in EE games.
 * - Classic uses plain numbers.
 */
export enum Direction {
  S = 0,
  SSW = 1,
  SW = 2,
  SWW = 3,
  W = 4,
  NWW = 5,
  NW = 6,
  NNW = 7,
  N = 8,
  NNE = 9,
  NE = 10,
  NEE = 11,
  E = 12,
  SEE = 13,
  SE = 14,
  SSE = 15,
}
