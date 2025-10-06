// import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
// import React, { useState } from 'react';
// import { COLORS } from '../../../../../styles/colors';
// import { BASE_URL } from '../../../../../utils/apiurls';

// const { width } = Dimensions.get('window');

// const GeneralInformation = ({ item, }) => {
//   console.log(item)
//   const { product } = item;
//   console.log(product)
//   const {form_options}=item
//   console.log(form_options)
//   const [imageError, setImageError] = useState(false);
 

//   const InfoCard = ({ title, children, defaultExpanded = true }) => {
//     const [expanded, setExpanded] = useState(defaultExpanded);

//     return (
//       <View style={styles.card}>
//         <TouchableOpacity
//           style={styles.cardHeader}
//           onPress={() => setExpanded(!expanded)}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.sectionTitle}>{title}</Text>
//           <Text style={[styles.expandIcon, expanded && styles.expandIconRotated]}>
//             ▼
//           </Text>
//         </TouchableOpacity>
//         {expanded && <View style={styles.cardContent}>{children}</View>}
//       </View>
//     );
//   };

//   const InfoRow = ({ label, value, highlight = false }) => (
//     <View style={styles.infoRow}>
//       <Text style={styles.label}>{label}</Text>
//       <Text style={[styles.value, highlight && styles.highlightValue]}>{value || '-'}</Text>
//     </View>
//   );

//   const StatusBadge = ({ status, trueText = 'Yes', falseText = 'No' }) => (
//     <View style={[styles.badge, status ? styles.successBadge : styles.errorBadge]}>
//       <Text style={[styles.badgeText, status ? styles.successText : styles.errorText]}>
//         {status ? trueText : falseText}
//       </Text>
//     </View>
//   );

//   const PriceTag = ({ label, price, currency = '₹' }) => (
//     <View style={styles.priceContainer}>
//       <Text style={styles.priceLabel}>{label}</Text>
//       <Text style={styles.priceValue}>
//         {currency}{price || '-'}
//       </Text>
//     </View>
//   );

//   return (
//     <ScrollView 
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.scrollContent}
//     >
//       {/* Product Header with Image */}
//       <View style={styles.headerCard}>
//         {product?.image && !imageError ? (
//           <Image
//             source={{ uri: `${BASE_URL}${product.image}` }}
//             style={styles.productImage}
//             resizeMode="cover"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <View style={styles.placeholderImage}>
//             <Text style={styles.placeholderText}>📦</Text>
//             <Text style={styles.placeholderSubtext}>No Image</Text>
//           </View>
//         )}
        
//         <View style={styles.headerInfo}>
//           <Text style={styles.productName}>{product?.name || 'Unnamed Product'}</Text>
//           <View style={styles.priceRow}>
//             <PriceTag label="Sales Price" price={product?.list_price} />
//             {/* <PriceTag label="Type" price={product?.type} /> */}
//           </View>
//         </View>
//       </View>

//       {/* General Information */}
//       <InfoCard title="General Information">
//         <InfoRow label="Product Type" value={product?.type} />
//         <InfoRow label="Brand" value={product?.company_brand_id} />
//         <InfoRow label="Unit of Measure" value={product?.uom_id} />
//         <InfoRow label="Product Category" value={product?.categ_id} />
//         <InfoRow 
//           label="Tax" 
//           value={Array.isArray(product?.taxes_id) ? product.taxes_id.join(', ') : product?.taxes_id} 
//         />
        
//         <View style={styles.statusRow}>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Can be Sold</Text>
//             <StatusBadge status={product?.sale_ok} />
//           </View>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Can be Purchased</Text>
//             <StatusBadge status={product?.purchase_ok} />
//           </View>
//         </View>
        
//         <View style={styles.statusRow}>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Published</Text>
//             <StatusBadge status={product?.is_published} />
//           </View>
//         </View>
//       </InfoCard>

//       {/* Variants */}
//       <InfoCard title="Product Variants" defaultExpanded={false}>
//         <InfoRow label="Attribute" value={product?.attribute || 'None'} />
//         <InfoRow label="Value" value={product?.attribute_value || 'None'} />
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyStateText}>
//             {!product?.attribute ? 'No variants configured for this product' : 'Variant information available'}
//           </Text>
//         </View>
//       </InfoCard>

//       {/* Sales Information */}
//       <InfoCard title="Sales Configuration" defaultExpanded={false}>
//         <InfoRow 
//           label="Invoicing Policy" 
//           value={product?.invoice_policy || product?.invoicing_policy || 'Standard'} 
//         />
//         <InfoRow 
//           label="Optional Products" 
//           value={product?.optional_product_ids?.length > 0 ? `${product.optional_product_ids.length} products` : 'None'} 
//         />
//         <InfoRow 
//           label="Sales Description" 
//           value={product?.description_sale || 'No description'} 
//         />
//       </InfoCard>

//       {/* Ecommerce */}
//       <InfoCard title="E-commerce Settings" defaultExpanded={false}>
//         <View style={styles.statusRow}>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Available in Shop</Text>
//             <StatusBadge status={product?.website_published || product?.is_published} />
//           </View>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusLabel}>Website Visibility</Text>
//             <StatusBadge 
//               status={product?.website_visible !== false} 
//               trueText="Visible" 
//               falseText="Hidden" 
//             />
//           </View>
//         </View>
        
//         <InfoRow 
//           label="SEO Title" 
//           value={product?.website_meta_title || 'Not set'} 
//         />
//         <InfoRow 
//           label="Website Description" 
//           value={product?.website_meta_description || 'Not set'} 
//         />
//       </InfoCard>

//       {/* Inventory */}
//       <InfoCard title="Inventory Management" defaultExpanded={false}>
//         <InfoRow 
//           label="Tracking Method" 
//           value={product?.tracking || 'No tracking'} 
//         />
//         <InfoRow 
//           label="Current Stock" 
//           value={product?.qty_available !== undefined ? `${product.qty_available} units` : 'Not tracked'} 
//         />
//         <InfoRow 
//           label="Forecasted Quantity" 
//           value={product?.virtual_available !== undefined ? `${product.virtual_available} units` : 'Not available'} 
//         />
//         <InfoRow 
//           label="Reordering Rules" 
//           value={product?.orderpoint_ids?.length > 0 ? 'Configured' : 'None'} 
//         />
//       </InfoCard>

//       <View style={styles.bottomSpacing} />
//     </ScrollView>
//   );
// };

// export default GeneralInformation;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   headerCard: {
//     backgroundColor: COLORS.whiteColor || '#FFFFFF',
//     borderRadius: 16,
//     margin: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   productImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     marginBottom: 16,
//     backgroundColor: '#F5F5F5',
//   },
//   placeholderImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     backgroundColor: '#F0F0F0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 2,
//     borderColor: '#E0E0E0',
//     borderStyle: 'dashed',
//   },
//   placeholderText: {
//     fontSize: 48,
//     marginBottom: 8,
//   },
//   placeholderSubtext: {
//     fontSize: 16,
//     color: '#888',
//     fontWeight: '500',
//   },
//   headerInfo: {
//     gap: 12,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.darkText || '#1A1A1A',
//     textAlign: 'center',
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     gap: 16,
//   },
//   priceContainer: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   priceLabel: {
//     fontSize: 12,
//     color: COLORS.grayText || '#666',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   priceValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.primaryColor || '#007AFF',
//   },
//   card: {
//     backgroundColor: COLORS.whiteColor || '#FFFFFF',
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 4,
//     overflow: 'hidden',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FAFAFA',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//   },
//   cardContent: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: COLORS.darkText || '#1A1A1A',
//   },
//   expandIcon: {
//     fontSize: 12,
//     color: COLORS.grayText || '#666',
//     transform: [{ rotate: '0deg' }],
//     transition: 'transform 0.3s ease',
//   },
//   expandIconRotated: {
//     transform: [{ rotate: '180deg' }],
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.grayText || '#666',
//     flex: 1,
//     marginRight: 16,
//   },
//   value: {
//     fontSize: 14,
//     color: COLORS.darkText || '#1A1A1A',
//     flex: 1.5,
//     textAlign: 'right',
//   },
//   highlightValue: {
//     fontWeight: '600',
//     color: COLORS.primaryColor || '#007AFF',
//   },
//   statusRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 16,
//     marginTop: 16,
//   },
//   statusItem: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 8,
//   },
//   statusLabel: {
//     fontSize: 12,
//     color: COLORS.grayText || '#666',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   badge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     minWidth: 60,
//     alignItems: 'center',
//   },
//   successBadge: {
//     backgroundColor: '#E8F5E8',
//   },
//   errorBadge: {
//     backgroundColor: '#FFEBEE',
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   successText: {
//     color: '#2E7D32',
//   },
//   errorText: {
//     color: '#C62828',
//   },
//   emptyState: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//     marginTop: 12,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: COLORS.grayText || '#666',
//     textAlign: 'center',
//     fontStyle: 'italic',
//   },
//   bottomSpacing: {
//     height: 20,
//   },
// });


import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import { API_URLS, BASE_URL } from '../../../../../utils/apiurls';
import makeApiCall from '../../../../../utils/apiHelper';

const { width } = Dimensions.get('window');

const GeneralInformation = ({ item }) => {
  const { product, form_options } = item || {};
  const [imageError, setImageError] = useState(false);
  const [isLoding,setisLoding]=useState(false)
  const [singleProductsdata,setSingleProduct]=useState()

  // ✅ Map helpers
  const mapOption = (id, options) => (options && options[id]) || id || '-';
  

console.log(singleProductsdata,'----')

  const fechAttributedata=async()=>{
    try {
      setisLoding(true)
      const responce=await makeApiCall(API_URLS.getVariantData,'POST',{
        jsonrpc:'2.0',
        params:{variantData: "attribute", valueData: [], method: "GET"}
  
      })
      // console.log(responce?.result?.attribute_id,'Responce===Attribute')
      
        setSingleProduct(responce?.result?.attribute_id)
      
    } catch (error) {
      console.log(error)
    } finally{
      setisLoding(false)
    }
  }
useEffect(()=>{
  fechAttributedata()
},[])
  // ✅ Parse attributes nicely
  // const renderAttributes = () => {
  //   if (!Array.isArray(product?.attribute_line_ids) || product.attribute_line_ids.length === 0) {
  //     return (
  //       <View style={styles.emptyState}>
  //         <Text style={styles.emptyStateText}>No attributes configured</Text>
  //       </View>
  //     );
  //   }
  //   return product.attribute_line_ids.map((line) => {
  //     const attrId = line.attribute_input?.[0];
  //     const attrName = form_options?.uom_id?.[attrId] || attrId; 
  //     const values = line.attribute_value
  //       ? Object.values(line.attribute_value).join(', ')
  //       : '—';
  //     return (
  //       <View key={line.id} style={styles.infoRow}>
  //         <Text style={styles.label}>{attrName}</Text>
  //         <Text style={styles.value}>{values}</Text>
  //       </View>
  //     );
  //   });
  // };

  const renderAttributes = () => {
    if (!Array.isArray(product?.attribute_line_ids) || product.attribute_line_ids.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No attributes configured</Text>
        </View>
      );
    }
  
    return product.attribute_line_ids.map((line) => {
      // Attribute ID
      const attrId = line.attribute_input?.[0];
  
      // Use your fetched attribute mapping instead of uom_id
      const attrName = singleProductsdata?.[attrId] || attrId;
  
      // Attribute values (object → join)
      const values = line.attribute_value
        ? Object.values(line.attribute_value).join(', ')
        : '—';
  
      return (
        <View key={line.id} style={styles.infoRow}>
          <Text style={styles.label}>{attrName}</Text>
          <Text style={styles.value}>{values}</Text>
        </View>
      );
    });
  };
  

  // Collapsible InfoCard
  const InfoCard = ({ title, children, defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={[styles.expandIcon, expanded && styles.expandIconRotated]}>▼</Text>
        </TouchableOpacity>
        {expanded && <View style={styles.cardContent}>{children}</View>}
      </View>
    );
  };

  const InfoRow = ({ label, value, highlight = false }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlightValue]}>{value || '-'}</Text>
    </View>
  );

  const StatusBadge = ({ status, trueText = 'Yes', falseText = 'No' }) => (
    <View style={[styles.badge, status ? styles.successBadge : styles.errorBadge]}>
      <Text style={[styles.badgeText, status ? styles.successText : styles.errorText]}>
        {status ? trueText : falseText}
      </Text>
    </View>
  );

  const PriceTag = ({ label, price, currency = '₹' }) => (
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={styles.priceValue}>
        {currency}{price || '-'}
      </Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Product Header with Image */}
      <View style={styles.headerCard}>
        {product?.image && !imageError ? (
          <Image
            source={{ uri: `${BASE_URL}${product.image}` }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
            <Text style={styles.placeholderSubtext}>No Image</Text>
          </View>
        )}
        
        <View style={styles.headerInfo}>
          <Text style={styles.productName}>{product?.name || 'Unnamed Product'}</Text>
          <View style={styles.priceRow}>
            <PriceTag label="Sales Price" price={product?.list_price} />
          </View>
        </View>
      </View>

      {/* General Info */}
      <InfoCard title="General Information">
        <InfoRow label="Product Type" value={mapOption(product?.type, form_options?.type)} />
        <InfoRow label="Brand" value={mapOption(product?.company_brand_id, form_options?.company_brand_id)} />
        <InfoRow label="Unit of Measure" value={mapOption(product?.uom_id, form_options?.uom_id)} />
        <InfoRow label="Product Category" value={mapOption(product?.categ_id, form_options?.categ_id)} />
        <InfoRow 
          label="Tax" 
          value={Array.isArray(product?.taxes_id) ? product.taxes_id.map(t => form_options?.taxes_id?.[t] || t).join(', ') : product?.taxes_id} 
        />
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Can be Sold</Text>
            <StatusBadge status={product?.sale_ok} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Can be Purchased</Text>
            <StatusBadge status={product?.purchase_ok} />
          </View>
        </View>
      </InfoCard>

      {/* Attributes */}
      <InfoCard title="Product Attributes" defaultExpanded={false}>
        {renderAttributes()}
      </InfoCard>

      {/* Sales */}
      <InfoCard title="Sales Configuration" defaultExpanded={false}>
        <InfoRow 
          label="Invoicing Policy" 
          value={mapOption(product?.invoice_policy, form_options?.invoice_policy)} 
        />
        <InfoRow 
          label="Optional Products" 
          value={product?.optional_product_ids?.length > 0 ? 
            product.optional_product_ids.map(id => form_options?.optional_product_ids?.[id] || id).join(', ') 
            : 'None'} 
        />
        <InfoRow 
          label="Sales Description" 
          value={product?.description_sale || 'No description'} 
        />
      </InfoCard>

      {/* Inventory */}
      <InfoCard title="Inventory Management" defaultExpanded={false}>
        <InfoRow label="Tracking Method" value={product?.tracking || 'No tracking'} />
        <InfoRow label="Current Stock" value={`${product?.qty_available || 0} units`} />
        <InfoRow label="Forecasted Quantity" value={`${product?.virtual_available || 0} units`} />
      </InfoCard>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

export default GeneralInformation;

// --- Styles unchanged ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  headerCard: {
    backgroundColor: COLORS.whiteColor || '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  productImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  placeholderImage: {
    width: '100%', height: 200, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed',
  },
  placeholderText: { fontSize: 48, marginBottom: 8 },
  placeholderSubtext: { fontSize: 16, color: '#888', fontWeight: '500' },
  headerInfo: { gap: 12 },
  productName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-around' },
  priceContainer: { alignItems: 'center', flex: 1 },
  priceLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  card: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FAFAFA' },
  cardContent: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  expandIcon: { fontSize: 12, transform: [{ rotate: '0deg' }] },
  expandIconRotated: { transform: [{ rotate: '180deg' }] },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { fontSize: 14, fontWeight: '600', color: '#666', flex: 1 },
  value: { fontSize: 14, flex: 1.5, textAlign: 'right' },
  highlightValue: { fontWeight: '600', color: '#007AFF' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statusItem: { flex: 1, alignItems: 'center' },
  statusLabel: { fontSize: 12, color: '#666' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, minWidth: 60, alignItems: 'center' },
  successBadge: { backgroundColor: '#E8F5E8' },
  errorBadge: { backgroundColor: '#FFEBEE' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  successText: { color: '#2E7D32' },
  errorText: { color: '#C62828' },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyStateText: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  bottomSpacing: { height: 20 },
});

