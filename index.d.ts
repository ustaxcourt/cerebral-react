import * as React from 'react'
/* eslint-disable-next-line no-unused-vars */
import { ResolveValue, IResolve } from 'function-tree'
import { BaseControllerClass, Get } from 'cerebral'

export type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>

interface PropsMap {
  [prop: string]: ResolveValue
}

export const Container: React.ComponentClass<{
  app: BaseControllerClass
  children?: React.ReactNode
}>

type Reaction = <T>(name: string, deps: T, cb: (deps: T & { get: Get }) => void) => void

type ConnectedProps = { get: Get, reaction: Reaction }

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Omit<T, K extends keyof T> = Pick<T, ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never, [x: number]: never })[keyof T]>;

export function connect<ExternalProps>(
  component:IReactComponent<ExternalProps & ConnectedProps>
): IReactComponent<Omit<ExternalProps & ConnectedProps, keyof ConnectedProps>>

export function connect<ExternalProps, Deps>(
  depsMap: Deps,
  component:IReactComponent<ExternalProps & Deps & ConnectedProps>
): IReactComponent<Omit<ExternalProps & ConnectedProps, keyof ConnectedProps>>

export function connect<ExternalProps, Deps, MergeProps>(
  depsMap: Deps,
  merge: (props: ExternalProps, deps: Deps, get: Get) => MergeProps,
  component:IReactComponent<MergeProps & ConnectedProps>
): IReactComponent<Omit<ExternalProps & ConnectedProps, keyof ConnectedProps>>

declare type ComponentDecorator = <
  TComponent extends React.ComponentClass<any>
>(
  target: TComponent
) => TComponent | void

export function decorator(propsMap: PropsMap): ComponentDecorator
