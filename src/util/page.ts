export function getPageListRange(totalCount: number, page: number, pageSize: number): { from: number; count: number } {
  const from = (page - 1) * pageSize;
  if (from >= totalCount) {
    return { from: totalCount, count: 0 };
  }

  let end = from + pageSize;
  if (end > totalCount) {
    end = totalCount;
  }

  return { from, count: end - from };
}
