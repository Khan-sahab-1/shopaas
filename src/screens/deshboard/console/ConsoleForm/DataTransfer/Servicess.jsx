import { API_URLS } from "../../../../../utils/apiurls";

const urls=API_URLS
export async function fetchStoreOrders(filters, user){
    console.log('filter',filters,user,'OrderFilterUser------>>>')
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getStoreOrders, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: { user}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveOrderData(orderId,updatedOrderData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.saveStoreOrderData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    orderId,
                    updatedOrderData
                }
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function fetchOrderData(orderId, user){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getStoreOrderData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {orderId, user}
            })  
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function fetchOrderInvoiceData(orderId,formData=false,invoiceId=null){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getOrderInvoiceData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {orderId,invoiceId,formData}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
//pankaj react promotion get data on onclick of specific btn  end here 
export async function fetchSpecificData(userId=null,rt=null,id = null,origin = null,data){
    try {
        const axios = require("axios");
        // console.log('data for specific', userId,rt,id,origin,data)
        const response = await axios(API_URLS.getSpecificData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {userId,rt,id,origin,method:'GET'}
            })
        }, 7000);
        // console.log('executed', response)
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
//pankaj react promotion savePromtionData
export async function fetchPromotionData(userId=null,data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getPromotionData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {userId,method:'GET',data}
            })
        }, 7000);
        const res = await response.data;
        // console.log('res in api is', res)
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
export async function savePromtionData(id,updatedData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.savePromtionData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    id,updatedData
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveOrderInvoiceData(invoiceId,updatedInvoiceData){
    try {
        const axios = require("axios");
        if(updatedInvoiceData.hasOwnProperty('scheduled_date')){
            let scheduled_date = updatedInvoiceData.scheduled_date;
            scheduled_date = scheduled_date.replace('T',' ')
            updatedInvoiceData = {...updatedInvoiceData,...{scheduled_date}}
        }
        const response = await axios(API_URLS.saveOrderInvoiceData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    invoiceId,
                    updatedInvoiceData
                }
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function fetchOrderDeliveryData(orderId,formData=false,pickingId=null){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getOrderDeliveryData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {orderId,pickingId,formData}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveOrderDeliveryData(pickingId,updatedDeliveryData){
    try {
        const axios = require("axios");
        if(updatedDeliveryData.hasOwnProperty('scheduled_date')){
            let scheduled_date = updatedDeliveryData.scheduled_date;
            scheduled_date = scheduled_date.replace('T',' ')
            updatedDeliveryData = {...updatedDeliveryData,...{scheduled_date}}
        }
        const response = await axios(API_URLS.saveOrderDeliveryData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    pickingId,
                    updatedDeliveryData
                }
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function companyDataTransfer(page){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.companyDataTransfer, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    page
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveCompanyDataTransfer(page,transferId,updatedTransferData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.saveCompanyDataTransfer, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    page,
                    transferId,
                    updatedTransferData
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Ankit start 04/01/2023

export async function getToCompanyData(updatedTransferData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getToCompanyData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    updatedTransferData
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
// Ankit End 04/01/2023




//pankaj loyalty func  fetchLoyaltyData
export async function saveLoyaltyData(updatedData,id=null){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.saveLoyaltyData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    updatedData,id
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
export async function fetchLoyaltyData(type=null,data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getLoyaltyData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {type,method:'GET'}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function getProductOptions(origin,id,type,query=null){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getProductOptions, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    origin,id,type,query
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function getProductDataUpdate(page){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.productDataUpdate, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    page
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveProductDataUpdate(page,id,updateProductData){
    console.log('wow',page,id,updateProductData)
    try {
        const axios = require("axios");
        const params={
             page,
             id,
             updateProductData
         }
         console.log(params,'PARAMSDATA')
        const response = await axios(API_URLS.saveProductDataUpdate, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: params,
            })
        });
        const res = await response.data;
        console.log(res)
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function getStockInventory(){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.stockInventory, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveStockInventory(id,updatedData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.saveStockInventory, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    id,updatedData
                }
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function allowedCompanies(companyId){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.allowedCompanies, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {companyId}
            })
        });
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Piyush Kumar Bugid-1750 5/01/2023
// export async function fetchUserData(userId=null){
export async function fetchUserData(id=null){
// Piyush Kumar End
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.getUserData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                // Piyush Kumar Bugid-1750 5/01/2023
                // params: {userId,method:'GET'}
                params: {id,method:'GET'}
                // Piyush Kumar End
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveUserData(userId,updatedData){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.saveUserData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {
                    userId,updatedData,...{method:'POST'}
                }
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Piyush Kumar bugid- 1731 Date- 20/12/2022 added searchbar=null,productType=null
// export async function storeProducts(data){
export async function storeProducts(data,searchbar=null,productType=null){
    // Piyush Kumar bugid-1731 End
    console.log(data,searchbar,productType,'Store Products Data')

    try {
        const axios = require("axios");
        const response = await axios(API_URLS.storeProducts, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data,searchbar,productType
            })
        }, 7000);
        const res = await response.data;
        console.log(res,'Store Products Response')
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveStoreProducts(data){
    // console.log("api data.....>>\n\n",data)
    try {
        var bodyFormData = new FormData();
        // if(data.id)
        //     bodyFormData.append('id', data.id);
        // Object.keys(data.updatedData).forEach((key)=>{
        //     bodyFormData.append(key, data.updatedData[key]);
        // })

        // if(data.id)
        //     bodyFormData.append('id', data.id);
        //     Object.keys(data.updatedData).forEach((key)=>{
                // # mohit  25-07-2022 start bug-ID -1007 Solving the issue of image upload of product
                // if((typeof data.updatedData[key] != 'object') || (key=='reference_image'))
                //     { if(key=='reference_image'){
                //         console.log("data ", data.updatedData[key])
                //         data.updatedData[key]['filename'] = 'reactNative'
                        
                //     }
                        // bodyFormData.append(key, data.updatedData[key])
                // # mohit  25-07-2022 end bug-ID -1007 Solving the issue of image upload of product
                    // }
                    
                // else{
                //     bodyFormData.append(key,JSON.stringify(data.updatedData[key]));
                // };
        //         bodyFormData.append(key,JSON.stringify(data.updatedData[key]));
                                     
        // })
        if(data.id)
            bodyFormData.append('id', data.id);
            Object.keys(data.updatedData).forEach((key)=>{
                // bodyFormData.append(key,JSON.stringify(data.updatedData[key]));
                if((typeof data.updatedData[key] != 'object') ){
                    bodyFormData.append(key, data.updatedData[key]);
                    // console.log("\n...In if condition....\n")
                    // console.log("\n...bodyform data in save prod api ....\n",bodyFormData)
                }
                else{
                    bodyFormData.append(key,JSON.stringify(data.updatedData[key])); 
                    // console.log("\n...In if condition....\n")
                    // console.log("\n...bodyform data in save prod api ....\n",bodyFormData)  
                }              
        })
        if(data.hasOwnProperty('UpdatedExtraMediaData')){
            bodyFormData.append('ExtraMediaData', JSON.stringify(data.UpdatedExtraMediaData));
        }
        const axios = require("axios");
        // console.log("\n...bodyform data in save prod api ....\n",bodyFormData)
        const response = await axios(API_URLS.saveStoreProducts, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data"
            },
            data: bodyFormData
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function renewMembership(data){
    // console.log("renew membership.....api,....data\n",data)
    try {
        const axios = require("axios");
        const response = await axios(urls.renewMembership, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data || {}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function pricelists(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.pricelists, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function savePricelist(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.savePricelist, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


// Piyush Kumar bugid- 1731, 12/12/2022 crete product varient, Ecomm Categ, and product categ
export async function storeCategories(data, searchbar = null, productType = null) {
  const params = {
    data: data,
    searchbar: searchbar,
    productType: productType
  };

  console.log("📦 storeCategories Params:", params); // ✅ Console log the full payload here

  try {
    const axios = require("axios");

    const response = await axios(urls.storeCategories, {
      method: 'POST',
      timeout: 7000,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        jsonrpc: "2.0",
        params: params
      })
    });

    const res = await response.data;
    return res;
  } 
  catch (err) {
    console.log("❌ storeCategories Error:", err.message);
    return { error: err.message };
  }
}


export async function saveStoreCategory(data){
    try {
        var bodyFormData = new FormData();
        if(data.id)
            bodyFormData.append('id', data.id);
            Object.keys(data.updatedData).forEach((key)=>{
                if((typeof data.updatedData[key] != 'object') || (key=='reference_image'))
                    bodyFormData.append(key, data.updatedData[key]);
               
                else
                    bodyFormData.append(key,JSON.stringify(data.updatedData[key]));                 
        })
        if(data.hasOwnProperty('CategoryType')){
                bodyFormData.append('CategoryType', data.CategoryType);
            }
        const axios = require("axios");
        
        const response = await axios(urls.saveStoreCategory, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data"
            },
            data: bodyFormData
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}




export async function saveStoreProductsVarient(data){
    try {
        var bodyFormData = new FormData();
        if(data.id)
            bodyFormData.append('id', data.id);
            Object.keys(data.updatedData).forEach((key)=>{
                if((typeof data.updatedData[key] != 'object')){
                    bodyFormData.append(key, data.updatedData[key]);
                }
                else{
                    bodyFormData.append(key,JSON.stringify(data.updatedData[key])); 
                }               
        })
        const axios = require("axios");
        const response = await axios(urls.saveStoreProductsVarient, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data"
            },
            data: bodyFormData
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function storeProductVariantTree(data, searchbar = null) {
  const payload = {
    data: data,
    searchbar: searchbar
  };

  console.log("📦 Payload sent to storeProductVariantTree:", payload);

  try {
    const axios = require("axios");

    const response = await axios(urls.storeProductVarientTree, {
      method: 'POST',
      timeout: 7000, // ✅ proper timeout usage
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        jsonrpc: "2.0",
        params: payload
      })
    });

    const res = await response.data;
    return res;
  } 
  catch (err) {
    console.log("❌ Error in storeProductVariantTree:", err.message);
    return { error: err.message };
  }
}


// Piyush Kumar bugid -1731 end

// Piyush Kumar 5/01/2023 UserTree View Api 
export async function fetchUsersTreeData(userId=null,data){
    try {
        const axios = require("axios");
        
        const response = await axios(urls.getUsersTreeData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {userId,method:'GET'}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
// Piyush Kumar End

export async function UpdateQtyTree(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.UpdateQty, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function SaveUpdateQtyTree(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.SaveUpdateQty, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function fetchVariantData(variantData=null,valueData=null,data){
    try {
        const axios = require("axios");
        const response = await axios(urls.getVariantData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {variantData,valueData,method:'GET'}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function LotSerialTreeData(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.LotSerialTree, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function ProductLotData(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.prodcutLot, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Product Lot Data
export async function SaveProductLotData(data){
    try {
        const axios = require("axios");
        const response = await axios(urls.saveProdcutLot, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function storeBrands(data,searchbar=null,productType=null){
    console.log('Data---',data)
    try {
        const axios = require("axios");
        const response = await axios(urls.storeBrands, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data,searchbar,productType
            })
        }, 7000);
        const res = await response.data;
        console.log('Res----->>>',res)
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveStoreBrand(data){
    try {
        var bodyFormData = new FormData();
        if(data.id)
            bodyFormData.append('id', data.id);
            Object.keys(data.updatedData).forEach((key)=>{
                // # mohit  25-07-2022 start bug-ID -1007 Solving the issue of image upload of product
                if((typeof data.updatedData[key] != 'object') || (key=='reference_image'))
                    bodyFormData.append(key, data.updatedData[key]);
                // # mohit  25-07-2022 end bug-ID -1007 Solving the issue of image upload of product
               
                else
                    bodyFormData.append(key,JSON.stringify(data.updatedData[key]));                 
        })
        // Ankit 29-09-2022 Start bugid-1614 Adding Extra Media in Api while saving
        if(data.hasOwnProperty('CategoryType')){
                bodyFormData.append('CategoryType', data.CategoryType);
            }
        // Ankit 29-09-2022 End bugid-1614 Adding Extra Media in Api while saving
        const axios = require("axios");
        
        const response = await axios(urls.saveStoreBrand, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data"
            },
            data: bodyFormData
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function saveUomCategory(data){
    try {
        var bodyFormData = new FormData();
        if(data.id)
            bodyFormData.append('id', data.id);
            Object.keys(data.updatedData).forEach((key)=>{
                if((typeof data.updatedData[key] != 'object') || (key=='reference_image'))
                    bodyFormData.append(key, data.updatedData[key]);
               
                else
                    bodyFormData.append(key,JSON.stringify(data.updatedData[key]));                 
        })
        if(data.hasOwnProperty('CategoryType')){
                bodyFormData.append('CategoryType', data.CategoryType);
            }
        const axios = require("axios");
        
        const response = await axios(urls.saveUomCategory, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                "Content-Type": "multipart/form-data"
            },
            data: bodyFormData
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function storeUomCategory(data,searchbar=null,productType=null){
    try {
        const axios = require("axios");
        const response = await axios(urls.storeUomCategory, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data,searchbar,productType
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function ProductAttributeTree(data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.ProductAttributeTree, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}


export async function ProductAttributeForm(data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.ProductAttributeForm, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

export async function SaveProductAttribute(data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.SaveProductAttribute, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// /Contact page 
export async function fetchContactData(type=null,data){
    try {
        // console.log("conat api......\n",data)
        const axios = require("axios");
        const response = await axios(API_URLS.getContactUsData, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {type,method:'GET'}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Piyush Kumar 5/4/2023 Myorder Details Page
export async function fetchCustomerOrderDetails(data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.customerOrderDetails, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: {...data}
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}

// Piyush Kumar Activate and deactivate Pricelist
export async function changeActivePriceList(data){
    try {
        const axios = require("axios");
        const response = await axios(API_URLS.changeActivePriceList1, {
            method: 'POST',
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                jsonrpc: "2.0",
                params: data
            })
        }, 7000);
        const res = await response.data;
        return(res);
    } 
    catch (err) {
        return {'error':err.message};
    }
}
// Piyush Kumar End
