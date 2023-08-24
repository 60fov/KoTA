import Favicon from "../../public/favicon.svg"

export default function KotaLogo(props: { size?: number | string }) {
  const {
    size = 100
  } = props

  return (
    <div style={{ fontSize: size }}>
      <Favicon />
    </div>
  )
}