export default function ErrorBlock({ message }: { message: string }) {
  return (
    <div role="alert" className="container py-8">
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800">
        {message || 'Something went wrong.'}
      </div>
    </div>
  )
}
