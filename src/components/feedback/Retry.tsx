import { Button } from '../ui/button'
export default function Retry({ onClick }: { onClick: ()=>void }) {
  return <div className="container py-4"><Button onClick={onClick}>Retry</Button></div>
}
