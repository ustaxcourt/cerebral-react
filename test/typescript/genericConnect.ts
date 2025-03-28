import { RunableSequence } from 'cerebral'
import { sequences, state } from 'cerebral/tags'
import { createElement } from 'react'
import { connect } from '../..'

// Example of using types for global state
interface AppState {
  foo: {
    bar: string
  }
  user: {
    loggedIn: boolean
    logout: RunableSequence<{ redirect: boolean }>
  }
}
let State: AppState

interface Props {
  loggedIn: typeof State.user.loggedIn
  signOut: typeof State.user.logout
  userName: typeof State.foo.bar
}

export const Foo = connect<
  Props,
  { loggedIn: boolean; signOut: () => void; userName: string }
>(
  {
    loggedIn: state`user.loggedIn`,
    signOut: sequences`user.logout`,
    userName: state`foo.bar`,
  },
  function Foo({ loggedIn, signOut, userName }) {
    return loggedIn
      ? createElement('div', { onClick: () => signOut({ redirect: false }) })
      : createElement('div', { children: userName })
  }
)
