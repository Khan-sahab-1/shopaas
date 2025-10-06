import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../../../styles/colors';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import TextInputCompo from '../../../../../components/TextInputCompo';
import Stars from 'react-native-stars';
import ButtonCompo from '../../../../../components/ButtonCompo';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const EditShippingInformation = ({
  item,
 
  isVisible,
  onclose,
  previewdata,
}) => {
  // Date state
  const [isLoadin,setloding]=useState(false)
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(previewdata?.scheduled_date || "");

  // Dropdown options
  const formateCarrier = Object.entries(item?.[1]?.carrier_id_options ?? {}).map(([key, value]) => ({
    label: value,
    value: Number(key),
  }));
  const formateShippingPolicy = Object.entries(item?.[1]?.move_type_options ?? {}).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  const formateResponsible = Object.entries(item?.[1]?.user_id_options ?? {}).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  // State
  const [formData, setFormData] = useState({
    trackingReference: '',
    weight: '',
    weightForShipping: '',
    procurement: '',
    carrier: '',
    shippingPolicy: '',
    responsible: '',
    priority: 1,
  });

  // Reset formData when item changes
  useEffect(() => {
    if (item?.[0]) {
      const matchedCarrier = formateCarrier.find(c => c.value === item?.[0]?.carrier_id);
      const matchedShippingPolicy = formateShippingPolicy.find(p => p.value === item?.[0]?.move_type);
      const matchedResponsible = formateResponsible.find(r => r.value === item?.[0]?.user_id);

      setFormData({
        trackingReference: item?.[0]?.carrier_tracking_ref || '',
        weight: item?.[0]?.weight?.toString() || '',
        weightForShipping: item?.[0]?.weight_for_shipping?.toString() || '',
        procurement: item?.[0]?.procurement || '',
        carrier: matchedCarrier?.value || '',
        shippingPolicy: matchedShippingPolicy?.value || '',
        responsible: matchedResponsible?.value || '',
        priority: item?.[0]?.priority || 1,
      });
    }
  }, [item]);

  // Handlers
  const handleInputChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleDropdownChange = (field, item) =>
    setFormData(prev => ({ ...prev, [field]: item.value }));

  // Date Picker Handlers
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleDateConfirm = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setScheduledDate(formattedDate);
    hideDatePicker();
  };

  const handleupdate = async (pickingId) => {
    console.log(pickingId, 'ID');
    try {
      setloding(true);
  
      const payload = {
        jsonrpc: '2.0',
        params: {
          pickingId: pickingId,
          updatedDeliveryData: {
            scheduled_date: previewdata?.scheduled_date
              ? moment(scheduledDate).format("YYYY-MM-DD HH:mm")
              : "",
            carrier_id: String(formData?.carrier) || "",
            carrier_tracking_ref: formData?.trackingReference || "",
            move_type: formData?.shippingPolicy || "",
            priority: formData?.priority?.toString() || "1",
            user_id: formData?.responsible || "",
          },
        },
      };
  
      console.log("Payload:", payload);
  
      const res = await makeApiCall(API_URLS.saveOrderDeliveryData, 'POST', payload);
      console.log("Response:", res);
      if(res?.result?.message==='success'){
        onclose
      }
  
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setloding(false);
    }
  };
  
  const handleconfirm = () => {
    if (previewdata?.id) {
      handleupdate(previewdata?.id);
    }
  };
  
  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose} animationType="fade">
      <TouchableWithoutFeedback onPress={onclose}>
        <TouchableOpacity style={styles.modalOverlay} onPress={onclose}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Scheduled Date */}
                <Text style={styles.label}>Scheduled Date</Text>
                <TouchableOpacity style={{...styles.input, justifyContent: 'center'}} onPress={showDatePicker}>
                  <Text>{scheduledDate || "Select Date"}</Text>
                </TouchableOpacity>

                {/* Date Picker */}
                <DateTimePickerModal
                  isVisible={datePickerVisible}
                  mode="datetime"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                />

                <Text style={styles.label}>Weight</Text>
                <TextInputCompo
                  placeholder="Weight"
                  value={formData.weight}
                  style={styles.input}
                  editable={false}
                />

                <Text style={styles.label}>Weight For Shipping</Text>
                <TextInputCompo
                  placeholder="Weight for shipping"
                  value={formData.weightForShipping}
                  style={styles.input}
                  editable={false}
                />

                <Text style={styles.label}>Tracking Reference</Text>
                <TextInputCompo
                  placeholder="Tracking Reference"
                  value={formData.trackingReference}
                  style={styles.input}
                  onChangeText={text => handleInputChange('trackingReference', text)}
                />

                <Text style={styles.label}>Procurement Group</Text>
                <TextInputCompo
                  placeholder="Procurement"
                  value={formData.procurement}
                  style={styles.input}
                  editable={false}
                />

                <Text style={styles.label}>Carrier</Text>
                <Dropdowncomp
                  data={formateCarrier}
                  value={formData.carrier}
                  onChange={item => handleDropdownChange('carrier', item)}
                />

                <Text style={styles.label}>Shipping Policy</Text>
                <Dropdowncomp
                  data={formateShippingPolicy}
                  value={formData.shippingPolicy}
                  onChange={item => handleDropdownChange('shippingPolicy', item)}
                />

                <Text style={styles.label}>Responsible</Text>
                <Dropdowncomp
                  data={formateResponsible}
                  value={formData.responsible}
                  onChange={item => handleDropdownChange('responsible', item)}
                />

                <Text style={styles.label}>Priority</Text>
                <Stars
                  default={formData.priority}
                  count={3}
                  starSize={28}
                  update={val => setFormData(prev => ({ ...prev, priority: val }))}
                />

                <View style={styles.buttonGroup}>
                  <ButtonCompo title="Save" onPress={handleconfirm} />
                  <ButtonCompo
                    title="Cancel"
                    onPress={onclose}
                    style={{ backgroundColor: COLORS.blueColor }}
                  />
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditShippingInformation;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grayText,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
});
