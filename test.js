/**
 *
 * @param sen { String }
 * @constructor
 */
function StringChallenge(sen) {
  if (!sen) {
    throw new Error('Invalid input')
  }

  const arr = sen
    .split(' ')
    .filter((item) => !!item.trim())
    .map((item) => ({
      word: item,
      count: item.length
    }))
    .sort((a, b) => b.count - a.count)

  const { word } = arr[0]

  const token = '8f30wpen6d'

  let result = ''

  for (let i = 0; i < word.length; i++) {
    result += word[i] + token[i]
  }
  return result
}

// keep this function call here
console.log(StringChallenge('keep this function call here'))
// console.log(StringChallenge('keep this function call here'));
