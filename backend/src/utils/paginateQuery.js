export async function paginateQuery({
  model,
  query = {},
  search = null,
  searchFields = [],
  page = 1,
  limit = 10,
  sortBy = "_id",
  order = "desc",
  projection = null,
  populate = null,
}) {
  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  if (search && searchFields.length) {
    query.$or = searchFields.map(field => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  const [total, results] = await Promise.all([
    model.countDocuments(query),
    model.find(query, projection)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate(populate)
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    results,
  };
}