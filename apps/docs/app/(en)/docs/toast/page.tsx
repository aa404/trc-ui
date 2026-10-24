import { ToastContent, toastTitle } from "@/content/toast";

export const metadata = { title: toastTitle.en };

export default function Page() {
  return <ToastContent lang="en" />;
}
