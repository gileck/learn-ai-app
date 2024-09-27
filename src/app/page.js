import dynamic from "next/dynamic"

const HomeLazy = dynamic(() => import("./Home"), { ssr: false })
export default function Home() {
  return <HomeLazy />
}