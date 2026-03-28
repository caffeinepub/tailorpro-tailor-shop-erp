export const ns2date = (ns: bigint) => new Date(Number(ns) / 1_000_000);
export const date2ns = (d: string) =>
  BigInt(new Date(d).getTime()) * 1_000_000n;
export const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
export const fmtDate = (ns: bigint) => ns2date(ns).toLocaleDateString("en-IN");
export const fmtDateTime = (ns: bigint) =>
  ns2date(ns).toLocaleString("en-IN", {
    dateStyle: "short",
    timeStyle: "short",
  });

export const garmentKey = (g: Record<string, null>): string =>
  Object.keys(g)[0];
export const orderStatusKey = (s: Record<string, null>): string =>
  Object.keys(s)[0];
export const apptTypeKey = (t: Record<string, null>): string =>
  Object.keys(t)[0];
export const apptStatusKey = (s: Record<string, null>): string =>
  Object.keys(s)[0];
export const paymentStatusKey = (p: Record<string, null>): string =>
  Object.keys(p)[0];
