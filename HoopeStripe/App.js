import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Stripe from 'react-native-stripe-api';
const apiKey = 'pk_test_OyBMGgzxlfqS4CYNC72uLgjz00YbmNGZqU';
let that;
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    that = this;

    this.state = {
      money: '10',
      email: 'test@qq.com',
      cardID: '4242424242424242',
      month: '10',
      year: '19',
      cvc: '123',
      address: '123456',
      isLoading: false,
    };
  }

  async _pay() {
    const client = new Stripe(apiKey);

    // 获取token
    const token = await client.createToken({
      number: that.state.cardID,
      exp_month: that.state.month,
      exp_year: that.state.year,
      cvc: that.state.cvc,
      address_zip: that.state.address,
    });

    fetch('http://127.0.0.1:5000/charge', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token.id,
        money: that.state.money,
        email: that.state.email,
      }),
    })
      .then(responseJson => {
        // eslint-disable-next-line no-alert
        alert('支付成功');
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={that._pay}>
          <View style={styles.btn}>
            <Text style={styles.text}>去支付</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btn: {
    width: 200,
    height: 30,
    backgroundColor: '#999',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
  },
});
