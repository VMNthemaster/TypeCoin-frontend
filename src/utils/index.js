export const backgroundImageClasses = {
  backgroundImage:
    'url("https://cdn.pixabay.com/photo/2016/04/06/18/14/racing-1312447_960_720.png")',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100vw 90vh',
}

export const showAddress = (addr) => {
  return addr.substring(0,4) + '....' + addr.substring(addr.length - 4, addr.length)
}


// checks whether the sentence ends with a fullstop, exlamation, etc and also counts number of words in the sentence
export const checkEndingOfSentence = (sentenceArray) => {
  const parsedData = []
  for(let i = 0; i < sentenceArray.length; i++){
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

   const lastWord = sentence.split(' ').pop()
   
   parsedData[i] = {
    sentence,
    count,
    lastWord,
   }
}

export const getRandomNumbers = (min, max, numOfNumbers) => {
  let numArray = []
  for(let i = 0; i < numOfNumbers; i++){
    let tempNum = Math.floor(Math.random() * (max - min)) + min;
    numArray.push(tempNum)
  }

  return numArray;
}

export const checkIgnoredKey = (key) => {
  const ignoreKeyStrokes = [
    'Shift',
    'Alt',
    'Tab',
    'Escape',
    'CapsLock',
    'Control',
    'Meta',
    'ContextMenu',
    'Enter',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'Insert',
    'End',
    'PageUp',
    'PageDown',
    'Home',
    'Delete',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ]

  if(ignoreKeyStrokes.includes(key)) return true;

  return false;
}
