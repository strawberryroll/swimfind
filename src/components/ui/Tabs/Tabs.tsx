"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

import styles from "./Tabs.module.css";

type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
};

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
}: TabsProps) {
  const baseId = useId();
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.value,
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedValue = value ?? internalValue;
  const selectedItem = items.find((item) => item.value === selectedValue);

  function select(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = items.findIndex(
      (item) => item.value === selectedValue,
    );
    let nextIndex: number;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    const nextItem = items[nextIndex];
    if (!nextItem) {
      return;
    }

    event.preventDefault();
    select(nextItem.value);
    tabRefs.current[nextItem.value]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={styles.list}
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => {
          const isSelected = item.value === selectedValue;

          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[item.value] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={isSelected}
              aria-controls={
                isSelected ? `${baseId}-panel-${item.value}` : undefined
              }
              tabIndex={isSelected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${selectedItem.value}`}
          aria-labelledby={`${baseId}-tab-${selectedItem.value}`}
        >
          {selectedItem.content}
        </div>
      )}
    </div>
  );
}
