import makeApiCall from './apiHelper';
import { API_URLS } from './apiurls';
export const fetchSpecificData = async (userId, setIsLoading, setDataOptions) => {
  try {
    setIsLoading(true);

    const response = await makeApiCall(API_URLS.getSpecificData, 'POST', {
      jsonrpc: '2.0',
      params: {
        userId: userId,
        rt: null,
        id: null,
        origin: null,
        method: 'GET',
      },
    });

    console.log(response, 'Specific Data');

    // Check if the response and its items are valid before formatting.
    const formattedData = response?.result?.items?.map((item) => ({
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
