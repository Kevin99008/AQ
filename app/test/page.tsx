'use client';

import MyTimeline from "@/components/timeline/timeLine";

export default function Home() {
  return (
    <div className="flex flex-col items-center px-6 py-3 h-screen w-full overflow-x-auto">
      {/* Page Title */}
      <h1 className="text-lg font-semibold mb-4 mt-20 text-center">
        React Calendar Timeline in Next.js
      </h1>

      {/* Timeline Container */}
      <div className="w-full max-w-screen-lg">
        <MyTimeline />
      </div>
    </div>
  );
}
