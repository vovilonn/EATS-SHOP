const sliceTextUtility = (text: string, max: number) => {
  const sliceText = text.slice(0, max)

  return sliceText.length >= text.length ? text : sliceText + '...'
}

export default sliceTextUtility
