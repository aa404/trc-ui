import { FileUploadContent, fileUploadTitle } from "@/content/form-pages";

export const metadata = { title: fileUploadTitle.en };

export default function Page() {
  return <FileUploadContent lang="en" />;
}
