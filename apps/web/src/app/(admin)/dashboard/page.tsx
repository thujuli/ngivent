import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

// dummy data
const getData = async () => {
  const res = await fetch(
    "https://662dd263a7dda1fa378b5b89.mockapi.io/api/users",
  );
  const json = await res.json();
  return json;
};

const DashboardPage: React.FC = async () => {
  // fetch dummy data
  const data = await getData();

  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no events
          </h3>
          <p className="text-sm text-muted-foreground">
            Set up an event and proceed to sell tickets.
          </p>
          <Button className="mt-4">Add Event</Button>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
