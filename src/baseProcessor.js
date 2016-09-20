import stringProcessor from './stringProcessor'

const baseProcessor = (arrayOfStrings) => {
  var resultsJson = []

  arrayOfStrings.map(string => {
    resultsJson.push({
      input: string,
      output: stringProcessor(string)
    })
  })

  return resultsJson
}

export default baseProcessor