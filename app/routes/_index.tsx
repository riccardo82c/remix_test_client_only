import { ClientOnly } from "remix-utils/client-only"

export default function Index() {
  return (
    <ClientOnly fallback=
      {
        <p id="index-page">
          Fallback
        </p>
      }
    >
      {() => (
        <p id="index-page">
          index
        </p>
      )}
    </ClientOnly>
  )
}
