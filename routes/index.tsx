import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import ListDiff from "../islands/ListDiff.tsx";

export default define.page(function Home() {
  return (
    <div class="min-h-screen bg-[#fafafa]">
      <Head>
        <title>List Diff</title>
      </Head>
      <div class="px-6 md:px-12 py-8">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-2xl font-normal text-[#111] tracking-tight mb-2">
            List Diff
          </h1>
          <p class="text-[#666] text-sm mb-8">
            Compare two lists and find unique and common items.
          </p>
          <ListDiff />
        </div>
      </div>
    </div>
  );
});
