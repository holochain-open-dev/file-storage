import { ApolloClient } from '@apollo/client/core';

/**
 * Setups the given element with the ApolloClient dependency
 * The result is ready to call customElements.define()
 */
export function setupApolloClientElement(
  element: any,
  apolloClient: ApolloClient<any>
): typeof HTMLElement {
  return (class extends element {
    get _apolloClient() {
      return apolloClient;
    }
  } as any) as typeof HTMLElement;
}
