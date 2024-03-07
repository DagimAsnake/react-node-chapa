import { useState } from 'react';
import axios from 'axios';

const FormComponent = () => {
  const [form, setForm] = useState({
    amount: '',
    currency: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const tx_ref = `${form.first_name}-${Date.now()}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const urlDev = 'http://localhost:5000/accept-payment'
    const urlPro = "https://react-node-chapa.onrender.com/accept-payment"

    try {
      const res = await axios.post(
        urlPro,
        {
            amount: form.amount,
            currency: form.currency,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
            phone_number: form.phone_number,
          tx_ref,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      window.location.href = res.data.data.checkout_url;
      console.log(res);

      setForm({
        amount: '',
        currency: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        tx_ref,
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <form className='mt-8' onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-6'>
          <label className='block'>
            <span className='text-gray-700'>Amount</span>
            <input
              type='text'
              name='amount'
              value={form.amount}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Currency</span>
            <input
              type='text'
              name='currency'
              value={form.currency}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>First Name</span>
            <input
              type='text'
              name='first_name'
              value={form.first_name}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Last Name</span>
            <input
              type='text'
              name='last_name'
              value={form.last_name}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
          <label className='block'>
            <span className='text-gray-700'>Phone Number</span>
            <input
              type='text'
              name='phone_number'
              value={form.phone_number}
              onChange={handleChange}
              className='mt-1 p-1 border rounded-md w-full'
            />
          </label>
        </div>
        <button
          className='px-[100px] py-3 ml-3 rounded-md bg-green-600'
          type='submit'
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
