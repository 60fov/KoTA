type Props = React.HTMLAttributes<SVGSVGElement>

const Minus = (props: Props) => (
  <svg
    width={15}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.25 7.5a.5.5 0 0 1 .5-.5h9.5a.5.5 0 0 1 0 1h-9.5a.5.5 0 0 1-.5-.5Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
)

export default Minus