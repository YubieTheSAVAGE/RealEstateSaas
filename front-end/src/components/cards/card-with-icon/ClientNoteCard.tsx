import React from "react";
import { CardDescription, CardTitle } from "../../ui/card";

export default function ClientNoteCard({ clientNote }: { clientNote: string }) {
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="relative">
        <CardTitle>
          Note
        </CardTitle>
        <div className="absolute right-0 top-0 h-fit">
          </div>
          {!clientNote && (
            <div className="text-center mt-16">
              <CardDescription>
                No notes available
              </CardDescription>
            </div>
          )}
          {clientNote && (
            <CardDescription>
              {clientNote}
            </CardDescription>
          )}
        </div>
    </div>
  );
}
