import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URLS, BASE_URL } from "../../utils/apiurls";

export const AllproductsApi = createApi({
  reducerPath: "allproductsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getallProducts: builder.mutation({
      query: (body) => ({
        url: API_URLS.storeProducts,
        method: "POST",
        body: body, 
      }),
    }),
  }),
});

// export const { useGetProductsMutation } = AllproductsApi;
export const { useGetallProductsMutation } = AllproductsApi;
