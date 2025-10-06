import makeApiCall from './apiHelper';
import { API_URLS } from './apiurls';
export const fetchproductoptions = async (type, setIsLoading, setDataOptions,origin
) => {
  try {
    setIsLoading(true);

    const response = await makeApiCall(API_URLS.getProductOptions, 'POST', {
      jsonrpc: '2.0',
      params: {
        type: type,
        query: null,
        id: null,
        origin: origin,
      },
    });

    console.log(response, 'Specific Data');

    // Check if the response and its items are valid before formatting.
    const formattedData = response?.result?.data?.items?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

    setDataOptions(formattedData);

  } catch (error) {
    console.error('Error fetching specific data:', error);
   
  } finally {
    setIsLoading(false);
  }
};
