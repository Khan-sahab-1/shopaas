export function normalizeProductList(rawProducts = {}) {
  const keys = Object.keys(rawProducts || {});
  const dataKeys = keys.filter(
    k =>
      k.startsWith('products_data_') ||
      k.startsWith('products_') ||
      k.startsWith('product_template_'),
  );
  const merged = dataKeys.reduce((acc, key) => {
    const obj = rawProducts[key] || {};
    if (Array.isArray(obj)) {
      return acc.concat(obj);
    } else {
      const arr = Object.entries(obj).map(([id, data]) => ({id, ...data}));
      return acc.concat(arr);
    }
  }, []);
  return merged;
}

export function filterProductsByCategoryAndCompany(
  products = [],
  category,
  company,
) {
  if ((!category || category === null) && (!company || company === null))
    return products;
  return products.filter(product => {
    const productCategoryId = Array.isArray(product.categ_id)
      ? product.categ_id[0]
      : product.categ_id;
    const productCompanyId = Array.isArray(product.company_id)
      ? product.company_id[0]
      : product.company_id;

    const matchCategory =
      !category ||
      category === '' ||
      productCategoryId == (category.id ?? category);
    const matchCompany =
      !company ||
      company === '' ||
      productCompanyId ==
        (company.item?.[0] ?? company.item ?? company.id ?? company);

    return matchCategory && matchCompany;
  });
}
