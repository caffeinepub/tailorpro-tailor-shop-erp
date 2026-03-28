const ns2date = (ns) => new Date(Number(ns) / 1e6);
const fmt = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const fmtDate = (ns) => ns2date(ns).toLocaleDateString("en-IN");
const fmtDateTime = (ns) => ns2date(ns).toLocaleString("en-IN", {
  dateStyle: "short",
  timeStyle: "short"
});
const garmentKey = (g) => Object.keys(g)[0];
const orderStatusKey = (s) => Object.keys(s)[0];
const apptTypeKey = (t) => Object.keys(t)[0];
const apptStatusKey = (s) => Object.keys(s)[0];
const paymentStatusKey = (p) => Object.keys(p)[0];
export {
  apptStatusKey as a,
  fmtDateTime as b,
  apptTypeKey as c,
  fmtDate as d,
  fmt as f,
  garmentKey as g,
  orderStatusKey as o,
  paymentStatusKey as p
};
