import { TRIGGER } from '@/redux/automation-sclice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React from 'react';
import { useMutationData } from './use-mutation-data';
import { onSaveTrigger as saveTrigger } from '@/actions/automation';

const useTriggers = (id: string) => {
  const types = useAppSelector((state) => state.automation.trigger?.types);

  const dispatch = useAppDispatch();

  const onSetTrigger = (type: 'COMMENT' | 'DM') => {
    dispatch(TRIGGER({ trigger: { type } }));
  };

  const { isPending, mutate } = useMutationData(
    ['add-trigger'],
    async (data) => {
      const { types } = data as unknown as { types: string[] };
      return await saveTrigger(id, types);
    },
    ['automation-info']
  );

  const onSaveTrigger = () => mutate({ types } as any);

  return { onSaveTrigger, onSetTrigger, types, isPending };
};

export default useTriggers;
