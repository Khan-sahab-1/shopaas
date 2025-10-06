// Program Type
export const ProgramType = [
  { label: "Promotion Program", value: "promotion_program" },
  { label: "Coupon Program", value: "coupon_program" },
];

// Customer Scope
export const CustomerScope = [
  { label: "Per User", value: "per_cust" },
  { label: "Overall Coupon", value: "overall_coupon" },

];
// options.js
export const CustomerTargetOptions = [
    { label: 'ALL', value: 'is_all_cust' },
    { label: 'Specific Customer', value: 'is_specific_cust' },
  ];
  
// Product Scope
export const ProductScope = [
  { label: "ALL", value: "is_all" },
  { label: "Specific Product", value: "is_specific" },
];

// Tax Type
export const TaxType = [
  { label: "Tax Include", value: "tax_included" },
  { label: "Tax Exclude", value: "tax_excluded" },
];

// Code Requirement
export const CodeRequirement = [
  { label: "Automatically Applied", value: "no_code_needed" },
  { label: "Use a code", value: "code_needed" },
];

// Reward Type
export const RewardType = [
  { label: "Discount", value: "discount" },
  { label: "Free Product", value: "product" },
  { label: "Free Shipping", value: "free_shipping" },
];

// Discount Type
export const DiscountType = [
  { label: "None", value: "" },
  { label: "Percentage", value: "percentage" },
  { label: "Fixed Amount", value: "fixed_amount" },
];

// Apply On
export const ApplyOn = [
  { label: "On order", value: "on_order" },
  { label: "On cheapest product", value: "cheapest_product" },
  { label: "On specific products", value: "specific_products" },
];
