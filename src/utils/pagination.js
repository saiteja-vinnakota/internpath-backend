const getPagination = (page, limit) => {

  const currentPage = Math.max(1, Number(page) || 1);

  const perPage = Math.max(1, Number(limit) || 10);

  const skip = (currentPage - 1) * perPage;

  return {
    currentPage,
    perPage,
    skip
  };
};

export default getPagination;