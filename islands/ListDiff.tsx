import { useSignal } from "@preact/signals";

interface ListDiffOptions {
  caseSensitive: boolean;
  ignoreBeginEndSpaces: boolean;
  ignoreExtraSpaces: boolean;
}

interface ComparisonResult {
  aOnly: string[];
  bOnly: string[];
  intersection: string[];
  union: string[];
}

function normalizeItem(
  item: string,
  options: ListDiffOptions,
): string {
  let normalized = item;

  if (options.ignoreBeginEndSpaces) {
    normalized = normalized.trim();
  }

  if (options.ignoreExtraSpaces) {
    normalized = normalized.replace(/\s+/g, " ");
  }

  if (!options.caseSensitive) {
    normalized = normalized.toLowerCase();
  }

  return normalized;
}

function compareLists(
  listA: string[],
  listB: string[],
  options: ListDiffOptions,
): ComparisonResult {
  // Create maps with normalized keys pointing to original values
  const mapA = new Map<string, string>();
  const mapB = new Map<string, string>();

  for (const item of listA) {
    if (item.trim() !== "") {
      const normalized = normalizeItem(item, options);
      if (!mapA.has(normalized)) {
        mapA.set(normalized, item);
      }
    }
  }

  for (const item of listB) {
    if (item.trim() !== "") {
      const normalized = normalizeItem(item, options);
      if (!mapB.has(normalized)) {
        mapB.set(normalized, item);
      }
    }
  }

  const aOnly: string[] = [];
  const intersection: string[] = [];
  const bOnly: string[] = [];
  const union: string[] = [];

  // Items in A only and intersection
  for (const [normalized, original] of mapA) {
    if (mapB.has(normalized)) {
      intersection.push(original);
    } else {
      aOnly.push(original);
    }
    union.push(original);
  }

  // Items in B only
  for (const [normalized, original] of mapB) {
    if (!mapA.has(normalized)) {
      bOnly.push(original);
      union.push(original);
    }
  }

  return { aOnly, bOnly, intersection, union };
}

function ResultSection({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(items.join("\n"));
  };

  return (
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class={`font-semibold ${color}`}>
          {title} ({items.length})
        </h3>
        <button
          onClick={copyToClipboard}
          class="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          title="Copy to clipboard"
        >
          Copy
        </button>
      </div>
      <div class="bg-gray-50 rounded p-2 max-h-48 overflow-y-auto font-mono text-sm">
        {items.length > 0
          ? (
            <ul class="space-y-1">
              {items.map((item, index) => (
                <li key={index} class="break-all">
                  {item}
                </li>
              ))}
            </ul>
          )
          : <p class="text-gray-400 italic">No items</p>}
      </div>
    </div>
  );
}

export default function ListDiff() {
  const listA = useSignal("");
  const listB = useSignal("");
  const caseSensitive = useSignal(false);
  const ignoreBeginEndSpaces = useSignal(true);
  const ignoreExtraSpaces = useSignal(false);
  const result = useSignal<ComparisonResult | null>(null);

  const handleCompare = () => {
    const itemsA = listA.value.split("\n");
    const itemsB = listB.value.split("\n");

    const options: ListDiffOptions = {
      caseSensitive: caseSensitive.value,
      ignoreBeginEndSpaces: ignoreBeginEndSpaces.value,
      ignoreExtraSpaces: ignoreExtraSpaces.value,
    };

    result.value = compareLists(itemsA, itemsB, options);
  };

  const handleClear = () => {
    listA.value = "";
    listB.value = "";
    result.value = null;
  };

  const handleSwap = () => {
    const temp = listA.value;
    listA.value = listB.value;
    listB.value = temp;
    result.value = null;
  };

  return (
    <div class="w-full max-w-6xl mx-auto">
      {/* Input Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            List A
          </label>
          <textarea
            class="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
            placeholder="Enter items (one per line)..."
            value={listA.value}
            onInput={(e) => listA.value = (e.target as HTMLTextAreaElement).value}
          />
          <p class="text-xs text-gray-500 mt-1">
            {listA.value.split("\n").filter((line) => line.trim() !== "").length}{" "}
            items
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            List B
          </label>
          <textarea
            class="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
            placeholder="Enter items (one per line)..."
            value={listB.value}
            onInput={(e) => listB.value = (e.target as HTMLTextAreaElement).value}
          />
          <p class="text-xs text-gray-500 mt-1">
            {listB.value.split("\n").filter((line) => line.trim() !== "").length}{" "}
            items
          </p>
        </div>
      </div>

      {/* Options Section */}
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Options</h3>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive.value}
              onChange={(e) =>
                caseSensitive.value = (e.target as HTMLInputElement).checked}
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Case Sensitive</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreBeginEndSpaces.value}
              onChange={(e) =>
                ignoreBeginEndSpaces.value =
                  (e.target as HTMLInputElement).checked}
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Ignore Begin/End Spaces</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreExtraSpaces.value}
              onChange={(e) =>
                ignoreExtraSpaces.value =
                  (e.target as HTMLInputElement).checked}
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Ignore Extra Spaces</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="flex gap-3 mb-6">
        <button
          onClick={handleCompare}
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Compare Lists
        </button>
        <button
          onClick={handleSwap}
          class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Swap A/B
        </button>
        <button
          onClick={handleClear}
          class="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Results Section */}
      {result.value && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultSection
            title="A only"
            items={result.value.aOnly}
            color="text-red-600"
          />
          <ResultSection
            title="A ∩ B"
            items={result.value.intersection}
            color="text-green-600"
          />
          <ResultSection
            title="B only"
            items={result.value.bOnly}
            color="text-blue-600"
          />
          <ResultSection
            title="A ∪ B"
            items={result.value.union}
            color="text-purple-600"
          />
        </div>
      )}
    </div>
  );
}
