import sampleData from "./sampleData";

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// mocks a delay in fetching the Events data, then return them
export const fetchSampleData = () => {
  return delay(1000).then(() => {
    return Promise.resolve(sampleData);
  });
};
