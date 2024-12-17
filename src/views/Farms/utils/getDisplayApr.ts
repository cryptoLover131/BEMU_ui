export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    if (cakeRewardsApr + lpRewardsApr > 10**6)
      return `~${(cakeRewardsApr + lpRewardsApr).toPrecision(6)}`
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    if (cakeRewardsApr > 10**6)
      return `~${cakeRewardsApr.toPrecision(6)}`
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
