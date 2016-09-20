import stringProcessor from './stringProcessor'

var baseProcessor = (arrayOfStrings) => {
  console.log(arrayOfStrings)
  var resultsJson = {}

  arrayOfStrings.map(string => {
    resultsJson[string] = stringProcessor(string)
  })

  return resultsJson
}

export default baseProcessor