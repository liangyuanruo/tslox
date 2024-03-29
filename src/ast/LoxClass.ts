import { Interpreter } from '../Interpreter'
import { LoxInstance } from './LoxInstance'
import { LoxCallable, LoxFunction, LoxObject } from './types'

export class LoxClass extends LoxCallable {
  name: string
  readonly superclass: LoxClass | null
  private readonly methods: Record<string, LoxFunction>

  constructor(name: string, superclass: LoxClass | null, methods: Record<string, LoxFunction>) {
    super()
    this.superclass = superclass
    this.name = name
    this.methods = methods
  }

  findMethod(name: string): LoxFunction | null {
    if (name in this.methods) {
      return this.methods[name]
    }

    if (this.superclass !== null) {
      return this.superclass.findMethod(name)
    }

    return null
  }

  toString() {
    return this.name
  }

  call(interpreter: Interpreter, args: Array<LoxObject>) {
    const instance = new LoxInstance(this)
    const initializer = this.findMethod('init')
    if (initializer !== null) {
      initializer.bind(instance).call(interpreter, args)
    }

    return instance
  }

  arity(): number {
    const initializer = this.findMethod('init')
    if (initializer === null) return 0
    return initializer.arity()
  }
}
