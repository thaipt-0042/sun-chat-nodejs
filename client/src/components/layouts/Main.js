import React from 'react';
import Head from './Head';
import Sidebar from './Sidebar';
import { Layout } from 'antd'

export default ({ children }) => {
  return (
    <React.Fragment>
      {!children._owner.return.memoizedProps.withoutLayout ? (
      <Layout>
        <Sidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Head />
          { children }
        </Layout>
      </Layout>
      ) : children }
    </React.Fragment>
  )
}
