import { ChainId, Token, WETH } from '@conduitxyz/uniswap-v2-sdk'
import KOVAN_TOKENS from './kovan'
import MAINNET_TOKENS from './mainnet'
import RINKEBY_TOKENS from './rinkeby'
import ROPSTEN_TOKENS from './ropsten'
import CONDUIT_TOKENS from './conduit'

type AllTokens = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: Token }> }>
export const ALL_TOKENS: AllTokens = [
  // WETH on all chains
  ...Object.values(WETH),
  // chain-specific tokens
  ...MAINNET_TOKENS,
  ...RINKEBY_TOKENS,
  ...KOVAN_TOKENS,
  ...ROPSTEN_TOKENS,
  ...CONDUIT_TOKENS
]
  // remap WETH to ETH
  .map(token => {
    WETH[888] = new Token(888, '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853', 18, 'WETH', 'Wrapped Ether')

    if (token.equals(WETH[token.chainId])) {
      ;(token as any).symbol = 'ETH'
      ;(token as any).name = 'Ether'
    }
    return token
  })
  // put into an object
  .reduce<AllTokens>(
    (tokenMap, token) => {
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    {
      [ChainId.MAINNET]: {},
      [ChainId.RINKEBY]: {},
      [ChainId.GÖRLI]: {},
      [ChainId.ROPSTEN]: {},
      [ChainId.KOVAN]: {},
      [888]: {}
    }
  )