export interface Controllable<T> {
  defaultValue?: T
  value?: T
  onValueChange?: (value: T) => void
}
