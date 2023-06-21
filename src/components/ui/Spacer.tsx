interface SpacerProps {
  size?: number | string
}

const Spacer = {
  Row: ({ size }: SpacerProps) => <div style={{ display: 'inline-block', width: '100%', height: size }} />,
  Column: ({ size }: SpacerProps) => <div style={{ display: 'inline-block', height: '100%', width: size }} />,
  Flex: ({ flex }: { flex: string }) => <div style={{ display: 'inline-block', flex }} />
}

export default Spacer