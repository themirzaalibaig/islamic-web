import { useHadith } from '../'

export const Haidth = () => {
  const { getCollections } = useHadith()
  getCollections().then((res) => {
    console.log(res)
  })
  return <div>Haidth</div>
}
