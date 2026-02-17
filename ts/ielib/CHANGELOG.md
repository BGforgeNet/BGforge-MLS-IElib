# Changelog

## 0.3.0

- `Animate`, `CLASS`, `RACE` are now `declare enum` -- use `Animate.ANKHEG`, `CLASS.FIGHTER`, `RACE.HUMAN`.
- Add `RACE` enum with full race.ids data.
- Add `Direction` enum, modal.ids constants, `ItmRef` type, `tlk()` function.
- Object specifiers (`LastAttackerOf`, etc.) accept an optional target parameter.
- `tra()` returns `StrRef`.

### Breaking changes

- Bare IDS constant exports (`ANKHEG`, `FIGHTER`, etc.) from animate.ids and class.ids removed. Use enum members instead.
- `ClassID` type renamed to `CLASS`; `RaceID` type renamed to `RACE`.

## 0.2.0

- Add `CreRef`, `StrRef`, `Direction` types.
- Action/trigger params use typed refs (`AreRef`, `CreRef`, `StrRef`) and `Direction` where applicable.

## 0.1.4

Add `Action` type for actions.

## 0.1.3

Switch `$tra` to `tra` and `$obj` to `obj`.

## 0.1.2

- Add bg2 animate.ids.
- Add death vars to `$obj` description.

## 0.1.1

Same as initial release.

## 0.1

Initial release.
