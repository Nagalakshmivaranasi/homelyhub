//centeralized API setup

import axios from 'axios';
import qs from 'qs'; // converts javascript object into a url query string
//{skill:{'js', 'react'}} => skill=js&skill=react

export const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
})


// one api configuration we reuse throughout react application