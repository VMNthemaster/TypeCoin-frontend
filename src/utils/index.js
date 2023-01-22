export const backgroundImageClasses = {
  backgroundImage:
    'url("https://cdn.pixabay.com/photo/2016/04/06/18/14/racing-1312447_960_720.png")',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  // background: 'rgba(0, 0, 0, 0.5)',
}

export const showAddress = (addr) => {
  return addr.substring(0,4) + '....' + addr.substring(addr.length - 4, addr.length)
}


// checks whether the sentence ends with a fullstop, exlamation, etc and also counts number of words in the sentence
export const checkEndingOfSentence = (sentenceArray) => {
  const parsedData = []
  for(let i = 0; i < 3; i++){
    if(sentenceArray[i].endsWith('.' || '!' || '?' || ';' || '(' || ')')){
      countNumOfWords(sentenceArray[i], parsedData, i)
    }
    else{
      const newSentence = sentenceArray[i] + '.'
      countNumOfWords(newSentence, parsedData, i)
    }
  }

  return parsedData
}

const countNumOfWords = (sentence, parsedData, i) => {
  const count = sentence.split(' ').filter(function(num) {
    return num !== ''
   }).length;
   
   parsedData[i] = {
    sentence,
    count,
   }
}
