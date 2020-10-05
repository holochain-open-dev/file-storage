/**
 * Setups the given element with the ApolloClient dependency
 * The result is ready to call customElements.define()
 */
export function setupApolloClientElement(element, apolloClient) {
    return class extends element {
        get _apolloClient() {
            return apolloClient;
        }
    };
}
//# sourceMappingURL=utils.js.map