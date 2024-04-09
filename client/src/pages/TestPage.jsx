import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import DetailsCard from '../components/Card/DetailsCard';
import GroupDropdown from '../components/Dropdown/GroupDropdown';

function TestPage() {
  return (
    <>
      <DetailsCard></DetailsCard>
      <GroupDropdown></GroupDropdown>
    </>
  );
}

export default TestPage