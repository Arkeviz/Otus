const helloPrefix = 'Hello, '

function greet(name: string) {
  return `${helloPrefix} ${name}!`
}
console.warn(greet('World'))
