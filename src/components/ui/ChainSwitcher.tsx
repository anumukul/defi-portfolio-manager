'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { SUPPORTED_CHAINS } from '@/lib/config'

export default function ChainSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Network:</span>
      <select
        value={chainId}
        onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}
        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
      >
        {SUPPORTED_CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      <span className="text-xs text-green-600">
        {currentChain?.symbol}
      </span>
    </div>
  )
}