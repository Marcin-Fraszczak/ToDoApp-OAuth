const useTextValidator = () => {
  const textValidator = (text, length) => text && (typeof text === 'string') && text.length >= length
  return textValidator
}

export default useTextValidator