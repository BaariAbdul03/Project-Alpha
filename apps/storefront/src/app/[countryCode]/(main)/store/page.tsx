import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <div className="py-6 content-container" data-testid="category-container">
      <div className="mb-8 text-2xl-semi">
        <h1 data-testid="store-page-title">All products</h1>
      </div>
      <PaginatedProducts page={1} countryCode={countryCode} />
    </div>
  )
}
