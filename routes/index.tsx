import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import ListDiff from "../islands/ListDiff.tsx";

export default define.page(function Home() {
  return (
    <div class="min-h-screen bg-gray-100">
      <Head>
        <title>List Diff - Compare Lists</title>
      </Head>
      <div class="px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">List Diff</h1>
          <p class="text-gray-600 mb-6">
            Compare two lists and find unique and common items.
          </p>
          <ListDiff />
        </div>
      </div>
    </div>
  );
});
