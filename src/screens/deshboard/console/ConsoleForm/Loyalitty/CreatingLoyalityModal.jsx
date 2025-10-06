import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../../../../../styles/colors';
import TextInputCompo from '../../../../../components/TextInputCompo';
import CheckBox from '@react-native-community/checkbox';
import ButtonCompo from '../../../../../components/ButtonCompo';
import Icon from 'react-native-vector-icons/Ionicons';

const CreatingLoyalityModal = ({ isVisible, onclose, item }) => {
  // States for form fields
  const [name, setName] = useState('');
  const [minimumPurchase, setMinimumPurchase] = useState('');
  const [customerAwarded, setCustomerAwarded] = useState('');
  const [pointsPerPurchase, setPointsPerPurchase] = useState('');
  const [maxRedeem, setMaxRedeem] = useState('');
  const [minRedeem, setMinRedeem] = useState('');
  const [company, setCompany] = useState('');
  const [oneTimeRedeem, setOneTimeRedeem] = useState(false);
  const [partialRedeem, setPartialRedeem] = useState(false);

  const handleSave = () => {
    const payload = {
      name,
      minimum_purchase: minimumPurchase,
      customer_awarded: customerAwarded,
      points_per_purchase: pointsPerPurchase,
      max_redeem: maxRedeem,
      min_redeem: minRedeem,
      company,
      one_time_redeem: oneTimeRedeem,
      partial_redeem: partialRedeem,
    };
    console.log('Saving Loyalty:', payload);
    // Call API here
    onclose();
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={onclose}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>

        <View style={styles.whiteBox}>
        <TouchableOpacity style={styles.closeBtn} onPress={onclose}>
            <Icon name="close" size={24} color={COLORS.blackColor} />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Name</Text>
            <TextInputCompo
              placeholder="Name"
              style={styles.inputBox}
              value={name}
              onChangeText={setName}
            />

            <Text style={{ ...styles.label, fontWeight: '800', fontSize: 20 }}>
              POINT CALCULATION
            </Text>

            <Text style={styles.label}>Minimum Purchase</Text>
            <TextInputCompo
              placeholder="Minimum Purchase"
              style={styles.inputBox}
              value={minimumPurchase}
              onChangeText={setMinimumPurchase}
            />

            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteText}>
              NOTES Minimum Purchase - is sale Order amount criteria which the customer has to
              satisfy to gain loyalty points. Benefits Awarded is the order stage at which the
              loyalty points will be transferred to customer accounts.
            </Text>

            <Text style={styles.label}>Customer will be awarded:</Text>
            <TextInputCompo
              placeholder="Customer will be awarded"
              style={styles.inputBox}
              value={customerAwarded}
              onChangeText={setCustomerAwarded}
            />

            <Text style={styles.label}>Points For a Purchase of every:</Text>
            <TextInputCompo
              placeholder="Points per purchase"
              style={styles.inputBox}
              value={pointsPerPurchase}
              onChangeText={setPointsPerPurchase}
            />

            <Text style={{ ...styles.label, fontWeight: '800', fontSize: 20 }}>
              REDEMPTION RULES
            </Text>

            <Text style={styles.label}>Maximum Redeem Amount Per Sale Order:</Text>
            <TextInputCompo
              placeholder="Max redeem amount"
              style={styles.inputBox}
              value={maxRedeem}
              onChangeText={setMaxRedeem}
            />

            <Text style={styles.label}>Minimum Redeem Amount:</Text>
            <TextInputCompo
              placeholder="Min redeem amount"
              style={styles.inputBox}
              value={minRedeem}
              onChangeText={setMinRedeem}
            />

            <Text style={styles.label}>Company:</Text>
            <TextInputCompo
              placeholder="Company"
              style={styles.inputBox}
              value={company}
              onChangeText={setCompany}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.label}>One Time Redeem:</Text>
              <CheckBox value={oneTimeRedeem} onValueChange={setOneTimeRedeem} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.label}>Partial Redeem:</Text>
              <CheckBox value={partialRedeem} onValueChange={setPartialRedeem} />
            </View>

            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteText}>
              NOTES Maximum Redeem amount per sale order - is the maximum amount of money that a
              user can redeem at once. Redeem Policy defines how redeem points are deducted.
              1. One Time Redeem: The user will lose all points for a single redemption.
              2. Partial Redeem: The user will lose only the appropriate number of points for a
              redemption.
            </Text>

            <ButtonCompo title="Save" onPress={handleSave} />
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CreatingLoyalityModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  whiteBox: {
    width: '100%',
    backgroundColor: COLORS.whiteColor,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '90%', // prevent overflow
  },
  inputBox: {
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.blackColor,
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.blackColor,
    marginBottom: 10,
  },
});
