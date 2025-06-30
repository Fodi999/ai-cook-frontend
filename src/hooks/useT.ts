'use client';

import { useTranslate } from '@tolgee/react';

export const useT = () => {
  const { t } = useTranslate();
  return t;
};

export default useT;
