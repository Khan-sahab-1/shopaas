import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Dropdowncomp from '../../../../../components/Dropdowncomp';
import { COLORS } from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import ButtonCompo from '../../../../../components/ButtonCompo';
import makeApiCall from '../../../../../utils/apiHelper';
import { API_URLS } from '../../../../../utils/apiurls';

const InvoicePaymentModal = ({ isVisible, onclose, data,invoiceId }) => {
  console.log(invoiceId, 'Payment Data');

  const formatted = data?.options?.journal_id?.map(journal => ({
    label: journal.name,
    value: journal.id,
  })) || [];

  const [selectedJournal, setSelectedJournal] = useState(null);

  useEffect(() => {
    if (data?.journal_id) {
      setSelectedJournal({
        label: data.journal_id.name,
        value: data.journal_id.id,
      });
    }
  }, [data]);


  const handlepaymentSubmit=async(jourmanId,action)=>{
    try {
        const payload={
            invoiceId: invoiceId,
            updatedInvoiceData: {
                payment_journal_id: jourmanId,
                action: action,
        }
    }
    console.log(payload, 'Payment Submit Payload');
        const responce=await makeApiCall(API_URLS.saveOrderInvoiceData,"POST",{
            jsonrpc: '2.0',
            params:payload,
        })
        console.log(responce, 'Payment Submit Response');
        if(responce?.result?.message === 'success') {
            onclose();
        }
    } catch (error) {
        console.log(error, 'Payment Submit Error');
    }
  }

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onclose}
    >
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
        <View style={styles.whiteBox}>
          <Text style={[styles.text, { fontSize: 20, fontWeight: '700' }]}>
            Payment Register
          </Text>

          <Text style={styles.text}>Journal</Text>
          <Dropdowncomp
            data={formatted}
            placeholder="Select Journal"
            labelField="label"
            valueField="value"
            value={selectedJournal}
            onChange={setSelectedJournal}
          />

          <Text style={styles.text}>Amount</Text>
          <TextInputCompo
            placeholder="Amount"
            style={styles.inputbox}
            value={data?.amount?.toString() || ''}
            editable={false}
          />

          <Text style={styles.text}>Date</Text>
          <TextInputCompo
            placeholder="Date"
            style={styles.inputbox}
            value={data?.payment_date || ''}
            editable={false}
          />

          <Text style={styles.text}>Memo</Text>
          <TextInputCompo
            placeholder="Memo"
            style={styles.inputbox}
            value={data?.communication || ''}
            editable={false}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <ButtonCompo
              title="Validate"
              style={{ width: '45%' }}
              onPress={() => {
                console.log('✅ Validate clicked with journal:', selectedJournal);
                handlepaymentSubmit(selectedJournal?.value, 'validate');
                // TODO: add actual submit logic here
              }}
            />
            <ButtonCompo
              title="Cancel"
              style={{ width: '45%' }}
              onPress={onclose}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default InvoicePaymentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: COLORS.blackColor,
    fontWeight: '600',
    marginTop: 10,
  },
  inputbox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    color: COLORS.blackColor,
    height: 50,
  },
});
