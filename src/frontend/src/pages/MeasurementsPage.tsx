import { useEffect, useState } from "react";
import { backend } from "../actor";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import type { Customer, Measurements } from "../tailor-types";

export default function MeasurementsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    backend.getCustomers().then(setCustomers);
  }, []);

  const mFields: { key: keyof Measurements; label: string }[] = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hip", label: "Hip" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeveLength", label: "Sleeve" },
    { key: "shirtLength", label: "Shirt L." },
    { key: "trouserLength", label: "Trouser L." },
    { key: "neck", label: "Neck" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Measurements</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map((c) => (
          <Card key={String(c.id)} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{c.name}</CardTitle>
              <p className="text-xs text-gray-500">{c.phone}</p>
            </CardHeader>
            <CardContent>
              {c.measurements[0] ? (
                <div className="grid grid-cols-4 gap-2">
                  {mFields.map((f) => (
                    <div key={f.key} className="text-center">
                      <p className="text-[10px] text-gray-400">{f.label}</p>
                      <p className="text-sm font-bold text-[#111827]">
                        {c.measurements[0]![f.key]}
                      </p>
                      <p className="text-[9px] text-gray-300">cm</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No measurements recorded
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
