import { html } from "lit-html";
import "@holochain-open-dev/file-storage/dist/elements/upload-files.js";
import "@holochain-open-dev/file-storage/dist/elements/file-storage-context.js";
import { FileStorageZomeMock } from "@holochain-open-dev/file-storage/dist/mocks.js";
import { FileStorageClient } from "@holochain-open-dev/file-storage";

const mock = new FileStorageZomeMock();

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
export default {
  title: "Frontend/Elements/upload-files",
  tags: ["autodocs"],
  component: "upload-files",
  render: (args) =>
    html`<file-storage-context .client=${new FileStorageClient(mock)}>
      <upload-files></upload-files>
    </file-storage-context>`,
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/web-components/writing-stories/args
export const Demo = {};
