import MessageShow from '../constant/MessageShow';
import makeApiCall from '../utils/apiHelper';
import {API_URLS} from './apiurls';

export const syncCartItem = async item => {
  console.log(item, 'item in syncCartItem');

  const defaultVariant = item?.variant_data?.[0]?.[0] || null;

  // Start with base params
  const params = {};

  if (item?.decremented) {
    // Payload for decrement
    params.product_id = defaultVariant;
    params.set_qty = item.quantity;
    params.add_qty = 0;
    params.return_updated_data = true;
    params.order_line = item.id;
  } else {
    params.product_id = defaultVariant;
    params.set_qty = 0;
    params.add_qty = item?.quantity || 1;
    params.product_template_id = item.id;
  }

  const payload = {
    jsonrpc: '2.0',
    params,
  };

  console.log(payload, 'payload in syncCartItem');

  try {
    const res = await makeApiCall(API_URLS.addToCart, 'POST', payload);
    console.log(res, 'res from syncCartItem');

    if (res?.result?.message === 'success' && !res?.result?.errorMessage) {
      console.log(`✅ Synced: ${item.name} (${item.quantity})`);
    } else {
      MessageShow.error(res?.result?.errorMessage || 'Failed to sync item');
    }
  } catch (err) {
    console.log('❌ Sync failed:', err);
  }
};
