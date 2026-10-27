import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

//fetch details of specific property using id

// 1.recieve property id
// 2.start loading
//4.call backend api
//5.wait for response
//6.get property data
//7.store details in redux
//8. if error occurs then , send error to redux


export const getPropertyDetails = (id) => async (dispatch) => {
    try {
        dispatch(propertyDetailsAction.getListRequest())
        const response = await axiosInstance(`/v1/rent/listing/${id}`)
        console.log(response)

        if (!response) {
            throw new Error("Could not fetch any property");
        }
        const {data} = response.data;
        dispatch(propertyDetailsAction.getPropertiesDetails(data))
    } catch (error) {
        dispatch(propertyDetailsAction.getErrors(error.response.data.error))
    }
}