import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">{children}</div>;
}
