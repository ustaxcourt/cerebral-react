import Hoc from './Hoc'
import connectFactory, { decoratorFactory } from './connect'

export { default as Container } from './Container'
export const connect = connectFactory(Hoc)
export const decorator = decoratorFactory(Hoc)
