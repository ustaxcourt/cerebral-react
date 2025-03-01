/* eslint-env mocha */

import App, { props, sequences, state } from 'cerebral'
import { Container, connect } from './'

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import assert from 'assert'

describe('React', () => {
  describe('container', () => {
    it('should expose app components', () => {
      const app = App({
        state: {
          foo: 'bar',
        },
      })
      const TestComponent = connect(
        {
          foo: state`foo`,
        },
        (props) => {
          return <div>{props.foo}</div>
        }
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )

      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar'
      )
    })
    it('should throw when no app provided', () => {
      const TestComponent = connect(
        {
          foo: state`foo`,
        },
        (props) => {
          return <div>{props.foo}</div>
        }
      )
      const originError = console.error
      console.error = () => {}
      assert.throws(
        () => {
          TestUtils.renderIntoDocument(
            <Container>
              <TestComponent />
            </Container>
          )
        },
        (err) => {
          console.error = originError
          if (err instanceof Error) {
            return (
              err.message ===
              'Cerebral - You are not passing a Cerebral app to Container'
            )
          }
        }
      )
    })
    it('should throw when container component is not provided', () => {
      const TestComponent = connect(
        {
          foo: state`foo`,
        },
        (props) => {
          return <div>{props.foo}</div>
        }
      )
      const originError = console.error
      console.error = () => {}
      assert.throws(
        () => {
          TestUtils.renderIntoDocument(<TestComponent />)
        },
        (err) => {
          console.error = originError
          if (err instanceof Error) {
            return (
              err.message ===
              'Cerebral - Can not find controller, did you remember to use the Container component? Read more at: http://cerebraljs.com/docs/api/components.html#react'
            )
          }
        }
      )
    })
    it('should be able to unregister component from container after unmounting component', () => {
      const app = App(
        {
          state: {
            foo: 'bar',
          },
        },
        {
          devtools: {
            init() {},
            send() {},
            updateWatchMap() {},
            updateComputedMap() {},
            sendWatchMap() {},
          },
        }
      )
      const TestComponent = connect(
        {
          foo: state`foo`,
        },
        (props) => {
          return <div>{props.foo}</div>
        }
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )
      const TestComponentRef = TestUtils.findRenderedComponentWithType(
        tree,
        TestComponent
      )
      assert.strictEqual(TestComponentRef._isUnmounting, undefined)
      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar'
      )
      ReactDOM.unmountComponentAtNode(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').parentNode
      )
      assert.strictEqual(TestComponentRef.view.isUnmounted, true)
      assert.deepStrictEqual(app.dependencyStore.getAllUniqueEntities(), [])
    })
  })
  describe('connect', () => {
    it('should convert component to json', () => {
      const app = App({
        state: {
          foo: 'bar',
        },
      })
      const MyComponent = (props) => {
        return <div>{props.foo}</div>
      }
      MyComponent.displayName = 'Test'
      const TestComponent = connect(
        {
          foo: state`foo`,
        },
        MyComponent
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )
      assert.strictEqual(
        TestUtils.findRenderedComponentWithType(tree, TestComponent).toJSON(),
        'Test'
      )
    })
    it('should render only ones where multiple state matches', () => {
      const app = App({
        state: {
          foo: 'bar',
          bar: 'foo',
        },
        sequences: {
          test: [
            ({ store }) => {
              store.set(state`foo`, 'bar2')
              store.set(state`bar`, 'foo2')
            },
          ],
        },
      })
      let renderCount = 0
      const TestComponent = connect(
        {
          foo: state`foo`,
          bar: state`bar`,
        },
        (props) => {
          renderCount++
          return <div>{props.foo}</div>
        }
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )

      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar'
      )
      assert.strictEqual(renderCount, 1)
      app.getSequence('test')()
      assert.strictEqual(renderCount, 2)
    })
    it('should only rerender affected components', () => {
      let renderCount = 0
      const app = App({
        state: {
          foo: 'bar',
        },
        sequences: {
          methodCalled: [({ store }) => store.set(state`foo`, 'bar2')],
        },
      })
      class TestComponentClass2 extends React.Component {
        render() {
          renderCount++
          return <div />
        }
      }
      const TestComponent2 = connect(TestComponentClass2)
      class TestComponentClass extends React.Component {
        callSignal() {
          this.props.methodCalled()
        }

        render() {
          renderCount++
          return (
            <div>
              <TestComponent2 />
            </div>
          )
        }
      }
      const TestComponent = connect(
        {
          foo: state`foo`,
          methodCalled: sequences`methodCalled`,
        },
        TestComponentClass
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )
      const component = TestUtils.findRenderedComponentWithType(
        tree,
        TestComponentClass
      )
      component.callSignal()
      assert.strictEqual(renderCount, 3)
    })
    it('should allow props tag and computed', () => {
      const app = App({
        state: {
          foo: {
            baz: 'mip',
          },
          aComputed: (get) => get(props`foo`),
        },
      })
      const TestComponent = connect(
        {
          a: state`aComputed`,
          b: props`bar.id`,
          c: state`foo.${props`propKey`}`,
        },
        ({ a, b, c }) => {
          return <div>{a + b + c}</div>
        }
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent foo="bar" bar={{ id: '1' }} propKey="baz" />
        </Container>
      )
      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar1mip'
      )
    })
    it('should update on props change', () => {
      const app = App({})
      class TestComponentClass2 extends React.Component {
        render() {
          return <div>{this.props.foo}</div>
        }
      }
      const TestComponent2 = connect(TestComponentClass2)
      class TestComponentClass extends React.Component {
        constructor(props) {
          super(props)
          this.state = { foo: 'bar' }
        }

        changePath() {
          this.setState({
            foo: 'bar2',
          })
        }

        render() {
          return (
            <span>
              <TestComponent2 foo={this.state.foo} />
            </span>
          )
        }
      }
      const TestComponent = connect(TestComponentClass)
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent />
        </Container>
      )
      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar'
      )
      const component = TestUtils.findRenderedComponentWithType(
        tree,
        TestComponentClass
      )
      component.changePath()
      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'bar2'
      )
    })
    it('should expose a merge signature', () => {
      const app = App({
        state: {
          foo: 'bar',
          bar: 'baz',
        },
      })
      const TestComponent = connect(
        {
          a: props`foo`,
          b: state`foo`,
        },
        (deps, props, get) => {
          return {
            a: deps.a,
            b: deps.b,
            c: props.foo + '!!!',
            d: get(state`bar`),
          }
        },
        ({ a, b, c, d }) => {
          return <div>{a + b + c + d}</div>
        }
      )
      const tree = TestUtils.renderIntoDocument(
        <Container app={app}>
          <TestComponent foo="bar" />
        </Container>
      )
      assert.strictEqual(
        TestUtils.findRenderedDOMComponentWithTag(tree, 'div').innerHTML,
        'barbarbar!!!baz'
      )
    })
  })
})
