import { Button } from '@/components/ui'
import { useState } from 'react'

export const VerifiyEmail = () => {
  const [counter, setCounter] = useState(0)

  return (
    <>
      <h1>
        It's a VerifiyEmail Page
        <Button onClick={() => setCounter(+1)}>Click me 😂</Button>
      </h1>
    </>
  )
}
