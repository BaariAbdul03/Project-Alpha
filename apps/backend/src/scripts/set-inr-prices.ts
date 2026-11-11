/**
 * Local prototype data: sets every variant's INR price to a synthetic ₹999.
 *
 *   npx medusa exec ./src/scripts/set-inr-prices.ts
 *
 * The storefront's `convertToLocale` formats the returned amount directly, so
 * the stored amount is the major unit: 999 renders as ₹999.00.
 * Safe to re-run; the workflow upserts the INR price per variant.
 */
import { updateProductVariantsWorkflow } from '@medusajs/medusa/core-flows'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import type { ExecArgs } from '@medusajs/framework/types'

const INR_PRICE = 999

export default async function setInrPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: variants } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'title', 'product.title'],
    filters: { deleted_at: null },
  })

  if (!variants.length) {
    logger.info('No variants found. Run the initial data seed first.')
    return
  }

  await updateProductVariantsWorkflow(container).run({
    input: {
      product_variants: variants.map((variant) => ({
        id: variant.id as string,
        prices: [{ amount: INR_PRICE, currency_code: 'inr' }],
      })),
    },
  })

  logger.info(
    `Set INR ${INR_PRICE} on ${variants.length} variant(s) across ${new Set(variants.map((variant) => (variant.product as { title?: string } | null)?.title)).size} product(s).`
  )
}
