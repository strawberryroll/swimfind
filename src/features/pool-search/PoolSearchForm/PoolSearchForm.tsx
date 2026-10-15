import Form from "next/form";

import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { MapPinIcon } from "@/components/ui/icons/MapPinIcon";
import { SearchIcon } from "@/components/ui/icons/SearchIcon";
import { Select } from "@/components/ui/Select/Select";

import { CurrentLocationButton } from "../CurrentLocationButton/CurrentLocationButton";
import { REGION_OPTIONS_MOCK } from "../mocks/search-options.mock";
import styles from "./PoolSearchForm.module.css";

export function PoolSearchForm() {
  return (
    <Form action="/pools" className={styles.form} role="search">
      <div className={styles.region}>
        <MapPinIcon size={16} className={styles.icon} />
        <Select name="region" aria-label="지역">
          {REGION_OPTIONS_MOCK.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div className={styles.query}>
        <SearchIcon size={16} className={styles.icon} />
        <Input
          name="q"
          type="search"
          aria-label="수영장 이름"
          placeholder="수영장 이름, 찾으시는 수영장이 있나요?"
          autoComplete="off"
        />
      </div>
      <div className={styles.location}>
        <CurrentLocationButton />
      </div>
      <Button type="submit" className={styles.submit}>
        수영장 검색
      </Button>
    </Form>
  );
}
