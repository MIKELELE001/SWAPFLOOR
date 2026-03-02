import { ComputeBudgetProgram } from '@solana/web3.js';

function toPosIntOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) return null;
  return n;
}

export function buildComputeBudgetIxs({
  computeUnitLimit = null,
  computeUnitPriceMicroLamports = null,
} = {}) {
  const ixs = [];
  const cuLimit = toPosIntOrNull(computeUnitLimit);
  const cuPrice = toPosIntOrNull(computeUnitPriceMicroLamports);

  // Order matters: limit then price. Both must be placed before "real" ixs.
  if (cuLimit) ixs.push(ComputeBudgetProgram.setComputeUnitLimit({ units: cuLimit }));
  if (cuPrice) ixs.push(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: cuPrice }));
  return ixs;
}

