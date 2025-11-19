import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteScrollDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: any[];
  displayField: string;
  valueField: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export function InfiniteScrollDropdown({
  value,
  onValueChange,
  placeholder,
  items,
  displayField,
  valueField,
  onLoadMore,
  hasMore,
  isLoading,
  disabled = false,
}: InfiniteScrollDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedItem = items.find((item) => item[valueField] === value);
  const displayText = selectedItem ? selectedItem[displayField] : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <span className={value ? "" : "text-gray-500"}>{displayText}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            id={`scrollable-dropdown-${valueField}`}
            className="absolute z-50 mt-1 h-[180px] w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
            style={{ maxHeight: "180px", overflowY: "auto" }}
          >
            <InfiniteScroll
              dataLength={items.length}
              next={onLoadMore}
              hasMore={hasMore && !isLoading}
              loader={
                <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
              }
              scrollableTarget={`scrollable-dropdown-${valueField}`}
              height={180}
            >
              {items.map((item) => (
                <button
                  key={item[valueField]}
                  type="button"
                  onClick={() => {
                    onValueChange(item[valueField]);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                    value === item[valueField] ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {item[displayField]}
                </button>
              ))}
            </InfiniteScroll>
          </div>
        </>
      )}
    </div>
  );
}
