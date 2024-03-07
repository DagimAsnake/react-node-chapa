const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();
const axios = require('axios');
const PORT = 5000;
const CHAPA_AUTH_KEY = process.env.CHAPA_AUTH_KEY; //Put Your Chapa Secret Key
const crypto = require('crypto');
const secret = process.env.SECRET_HASH;

app.post('/accept-payment', async (req, res) => {
  const {
    amount,
    currency,
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
  } = req.body;
  // console.log(req.body);

  try {
    const header = {
      headers: {
        Authorization: `Bearer ${CHAPA_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    const body = {
      amount: amount,
      currency: currency,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      tx_ref: tx_ref,
      meta: {
        course: "this is course",
        schedule: "this is schedule",
        phone: "this is phone number",
      },
      return_url: 'http://localhost:3000/',
    };
    let resp = '';
    await axios
      .post('https://api.chapa.co/v1/transaction/initialize', body, header)
      .then((response) => {
        resp = response;
      })
      .catch((error) => {
        console.log(error.response.data); // Prints the error response data
        console.log(error.response.status); // Prints the status code of the error response
        console.log(error.response.headers); // Prints the headers of the error response
        res.status(400).json({
          message: error,
        });
      });
    res.status(200).json(resp.data);
  } catch (e) {
    res.status(400).json({
      error_code: e.code,
      message: e.message,
    });
  }
});

app.post('/webhook', async (req, res) => {

  console.log("here is the webhook")
  // console.log('body: ', req.body);

  try {
    const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  const receivedSignature = req.headers['chapa-signature'];
  const alternativeSignature = req.headers['x-chapa-signature'];

  if (!receivedSignature && !alternativeSignature) {
    return res.status(400).send('No signature found');
  }

  if (hash !== receivedSignature && hash !== alternativeSignature) {
    return res.status(400).send('Invalid signature');
  }

  const {
    amount,
    currency,
    email,
    first_name,
    last_name,
    mobile,
    tx_ref,
    reference,
  } = req.body;

  // Parse the JSON string stored in the meta field
  const metaObject = JSON.parse(req.body.meta);
  const course = metaObject.course;
  const schedule = metaObject.schedule;
  const phone = metaObject.phone;

  console.log("COURSE", course)
  console.log('body: ', req.body);
  
  res.send(200);
  } catch (e) {
    res.status(400).json({
      error_code: e.code,
      message: e.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
