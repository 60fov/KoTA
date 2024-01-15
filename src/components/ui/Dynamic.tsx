import dynamic from "next/dynamic"

const Dynamic = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export default dynamic(() => Promise.resolve(Dynamic), { ssr: false })