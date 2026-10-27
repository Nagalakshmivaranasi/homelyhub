import { propertyAction } from "./property-slice";
import { axiosInstance } from "../../utils/axios";

//get all the properties
//1. start api request
//2.tell redux loading started
//3.get searchPerameters
//4.call backend api
//5.wait for response
//6.get property data
//7.Send data to redux store
//8. if error occurs then , send error to redux

//dispatch - SEND something to redux
//getState - GET the data from redux
export const getAllProperties = () => async (dispatch, getState) => {
  try {
    console.log("Api call");

    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().properties;

    const response = await axiosInstance.get("/v1/rent/listing", {
    //   params: searchParams || {},
        params: {...searchParams}
    });

    if (!response) {
      throw new Error("Could not fetch any properties");
    }

    const { data } = response;
    console.log("API response:", data);

    dispatch(propertyAction.getProperties(data))
    //   propertyAction.getProperties({
    //     data: data.data || data,
    //     all_properties: data.no_of_responses || data.length || 0,
    //   })
    
  } catch (error) {
    dispatch(propertyAction.getErrors(error.message));
  }
};