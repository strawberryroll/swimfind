import { notFound } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPoolById } from "@/server/pool/pool.service";
import PoolDetailPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("@/server/pool/pool.service", () => ({
  getPoolById: vi.fn(),
}));

const mockedNotFound = vi.mocked(notFound);
const mockedGetPoolById = vi.mocked(getPoolById);

describe("PoolDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    "abc",
    "0",
    "-1",
    "1.5",
    "2147483648",
    "Infinity",
    "0x1",
    "1e0",
    "1.0",
    "01",
  ])("잘못된 ID %s는 DB를 조회하지 않고 404 처리한다", async (poolId) => {
    await expect(
      PoolDetailPage({ params: Promise.resolve({ poolId }) }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");

    expect(mockedNotFound).toHaveBeenCalledOnce();
    expect(mockedGetPoolById).not.toHaveBeenCalled();
  });

  it("정상 범위의 없는 ID는 조회 후 404 처리한다", async () => {
    mockedGetPoolById.mockResolvedValueOnce(null);

    await expect(
      PoolDetailPage({ params: Promise.resolve({ poolId: "999999" }) }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");

    expect(mockedGetPoolById).toHaveBeenCalledExactlyOnceWith(999999);
    expect(mockedNotFound).toHaveBeenCalledOnce();
  });
});
