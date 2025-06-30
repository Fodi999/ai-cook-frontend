'use client';

import { ReactNode } from 'react';
import { TolgeeProvider } from '@tolgee/react';
import { tolgee } from '../lib/tolgee';

interface TolgeeWrapperProps {
  children: ReactNode;
}

export default function TolgeeWrapper({ children }: TolgeeWrapperProps) {
  return (
    <TolgeeProvider tolgee={tolgee}>
      {children}
    </TolgeeProvider>
  );
}
