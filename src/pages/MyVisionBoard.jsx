import React from 'react';
import BoardCollection from '../components/MyVisionBoard/BoardCollection';
import Layout from './Layout';

function MyVisionBoard() {
  return (
    <>
      <Layout>
        <BoardCollection></BoardCollection>
      </Layout>
    </>
  );
}

export default MyVisionBoard;
