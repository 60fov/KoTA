import { ResponsiveLine } from '@nivo/line'

interface Props {
  data: Array<{
    id: string | number
    data: Array<{
      x: number | string | Date
      y: number | string | Date
    }>
  }>
}

export default function LineChart(props: Props) {
  const {
    data
  } = props

  return (
    <ResponsiveLine
      data={data}
      useMesh={true}
      enableSlices={'x'}
      yScale={{type: "linear", min: 0, max: 1}}
      margin={{ top: 4, right: 4, bottom: 4, left: 28 }}
      axisBottom={null}
      colors={{scheme: 'accent'}}
      theme={{
        grid: {
          line: {
            stroke: "rgb(var(--color-back-alt))"
          }
        }
      }}
    />
  )
}