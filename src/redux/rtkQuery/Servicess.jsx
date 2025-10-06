import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URLS } from "../../utils/apiurls";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URLS.baseURL }),
  endpoints: (builder) => ({
    getProducts: builder.mutation({
      query: (body) => ({
        url: API_URLS.storeProducts,
        method: "POST",
        body: body, 
      }),
    }),
  }),
});

export const { useGetProductsMutation } = productsApi;
