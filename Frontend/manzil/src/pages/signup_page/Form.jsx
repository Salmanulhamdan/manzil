import React from 'react'

const Form = () => {
  return (
    <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100'>
      <h1 className='text-5xl font-semibold'>Welcome Back</h1>
      <p className='font-medium text-lg text-gray-500 mt-4'>Welcome back! Please enter your details.</p>
      <div className='mt-8'>
        <div>
            <label className='text-lg font-medium' htmlFor="email">Email</label>
            <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' type="email" placeholder='Enter your Email'/>
        </div>
        <div className='mt-4'>
            <label className='text-lg font-medium' htmlFor="password">Password</label>
            <input className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent' type="password" placeholder='Enter your Password'/>
        </div>
        <div className='flex justify-between mt-8 items-center'>
            <div className='flex '>
                <input type="checkbox" id='remember' />
                <label className='ml-2 font-medium text-base' htmlFor="remember">Remember for 30 days</label>
            </div>
            <button className='font-medium text-base text-violet-700'>Forgot password</button>
        </div>
        <div className='mt-8 flex justify-center'>
            <button className='active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all bg-violet-700 text-white text-lg font-bold w-full py-3 rounded-xl'>Sign in</button>
        </div>
        <div className='mt-8 flex justify-center items-center'>
            <p className='font-medium text-base'>Don't have an account ?</p>
            <button className='text-violet-700 font-medium text-base ml-2'>Sign up</button>
        </div>
      </div>
    </div>
  )
}

export default Form