interface IoptionsRenderingUtilityProps {
  options: Array<any>
  style: { [key: string]: string }
  selectedOption: string
  onSelectOption: (option: any) => void
}

const optionsRenderingUtility = (props: IoptionsRenderingUtilityProps) => {
  return props.options.map((option: any) => {
    const key = Math.random()

    const classNameOption: string = `
      ${props.style.option}
      ${props.selectedOption === option.name && props.style.active}
    `

    return (
      <button
        className={classNameOption}
        key={key}
        onClick={() => props.onSelectOption(option)}
      >
        {option.name}
      </button>
    )
  })
}

export default optionsRenderingUtility
