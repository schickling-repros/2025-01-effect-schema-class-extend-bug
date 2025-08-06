import { Schema } from 'effect'

class SomeClass extends Schema.Class<SomeClass>('SomeClass')({
  id: Schema.String,
  name: Schema.String,
}) {}

console.log('Testing Effect Schema class extension behavior...\n')

// This line fails at compilation time with:
// "Unsupported schema or overlapping types: cannot extend SomeClass with { readonly age: number }"
console.log('❌ FailingSchema (direct extend): SomeClass.pipe(Schema.extend(...)) throws compilation error')

// This works as a workaround
const PassingSchema = SomeClass.pipe(Schema.omit(), Schema.extend(Schema.Struct({ age: Schema.Number })))

const testData = {
  id: '123',
  name: 'John Doe',
  age: 30
}

console.log('Test data:', testData)

try {
  console.log('\n--- Testing PassingSchema (omit + extend workaround) ---')
  const passingResult = Schema.decodeUnknownSync(PassingSchema)(testData)
  console.log('✅ PassingSchema succeeded:', passingResult)
} catch (error) {
  console.log('❌ PassingSchema failed:', error.message)
}

console.log('\n--- Schema AST Types ---')
console.log('SomeClass AST type:', SomeClass.ast._tag)
console.log('PassingSchema AST type:', PassingSchema.ast._tag)

// Show the difference
console.log('\n--- Understanding the difference ---')
const OmittedSchema = SomeClass.pipe(Schema.omit())
console.log('SomeClass.pipe(Schema.omit()) AST type:', OmittedSchema.ast._tag)
console.log('This conversion from Transformation -> TypeLiteral enables Schema.extend() to work')