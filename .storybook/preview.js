import { setCustomElementsManifest } from "@storybook/web-components";
import customElements from "../ui/custom-elements.json";

setCustomElementsManifest(customElements);
export const parameters = {
  // actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    // expanded: true,
  },
};
