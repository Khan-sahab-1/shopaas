import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {API_URLS, BASE_URL} from '../../utils/apiurls';

export const ecommerceApi = createApi({
  reducerPath: 'ecommerceApi',
  baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
  endpoints: builder => ({
    getHomeData: builder.query({
      query: (params = {pageNumber: 1}) => ({
        url: API_URLS.getcatagory,
        method: 'POST',
        body: {jsonrpc: '2.0', params},
      }),
      keepUnusedDataFor: 60,
    }),
    getSliders: builder.query({
      query: () => ({
        url: API_URLS.getSliders,
        method: 'POST',
        body: {jsonrpc: '2.0', params: {}},
      }),
      keepUnusedDataFor: 120,
    }),
  }),
});

export const {useGetHomeDataQuery, useGetSlidersQuery} = ecommerceApi;
