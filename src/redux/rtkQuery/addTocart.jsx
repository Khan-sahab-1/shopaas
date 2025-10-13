import {createApi} from '@reduxjs/toolkit/query';
import {API_URLS, BASE_URL} from '../../utils/apiurls';

export const addTocart = createApi({
  reducerPath: 'addTocart',
  baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
  endpoints: builder => ({
    addToCart: builder.mutation({
      query: data => ({
        url: API_URLS.addToCart,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});
export const {useAddToCartMutation} = addTocart;
