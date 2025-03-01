import * as tt from 'typescript-definition-tester'
import * as ts from 'typescript'

export function compileDirectory(done) {
  const filter = (fileName) => fileName.match(/\.ts$/)
  const options = {
    experimentalDecorators: true,
    noImplicitAny: true,
    target: ts.ScriptTarget.ES2016,
  }

  tt.compileDirectory(__dirname, filter, options, done)
}
