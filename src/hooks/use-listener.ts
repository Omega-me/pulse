'use client';
import { useState } from 'react';
import { z } from 'zod';
import { useMutationData } from './use-mutation-data';
import { onSaveListener } from '@/actions/automation';
import useZodForm from './use-zod-form';

const promptSchema = z.object({
  prompt: z.string().min(1),
  reply: z.string(),
});

interface Data extends z.infer<typeof promptSchema> {}

const useListener = (id: string) => {
  const [listener, setListener] = useState<'SMARTAI' | 'MESSAGE'>(null);

  const onSetListener = (type: 'MESSAGE' | 'SMARTAI') => setListener(type);

  const { isPending, mutate } = useMutationData(
    ['create-listener'],
    async (data) => {
      const { prompt, reply } = data as unknown as Data;
      return await onSaveListener(id, listener || 'MESSAGE', prompt, reply);
    },
    ['automation-info']
  );

  const { onFormSubmit, register } = useZodForm(promptSchema, mutate);

  return { onSetListener, register, onFormSubmit, listener, isPending };
};

export default useListener;
