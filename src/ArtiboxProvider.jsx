// @flow

import React, { Fragment } from 'react';

type Props = {
  children: any,
};

function ArtiboxProvider({ children }: Props) {
  return (
    <Fragment>
      {children}
    </Fragment>
  );
}

export default ArtiboxProvider;
