import React, { useState } from 'react';

import MilestoneView from '../../components/payment/MilestoneView';
import Jalons from '../../components/payment/Jalons';


// Mock API function
const apiCall = async (endpoint, data) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`API Call to ${endpoint}:`, data);
  return { success: true, data };
};

const JalonsPage: React.FC = () => {

  return <Jalons  />;
};

export default JalonsPage;