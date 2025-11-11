import React from 'react';
import { useParams } from 'react-router-dom';

export default function DealerDetail() {
  const { id } = useParams();
  return (
    <div>
      <h2>Dealer Detail</h2>
      <p>Dealer ID: {id}</p>
      <p>Address, contacts, associated vehicles and contracts.</p>
    </div>
  );
}
