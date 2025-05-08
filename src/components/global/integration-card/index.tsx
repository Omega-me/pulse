'use client';
import { onOAuthInstagram } from '@/actions/integrations';
import { Button } from '@/components/ui/button';
import { IntegrationCardProps } from '@/constants/integrations';
import { useQueryUser } from '@/hooks/use-queries';
import React from 'react';

interface Props extends IntegrationCardProps {}

const IntegrationCard = (props: Props) => {
  const onInstaOAuth = () => onOAuthInstagram(props.strategy);

  const { data: user } = useQueryUser();

  const integrated = user?.data?.integrations.find((integration) => integration.name === props.strategy);

  return (
    <div className="border-2 border-[#3352cc] rounded-2xl gap-x-5 p-5 flex items-center">
      {props.icon}
      <div className="flex flex-col flex-1">
        <h3 className="text-xl">{props.title}</h3>
        <p className="text-[#9d9d9d] text-base w-full">{props.descriptions}</p>
      </div>
      <Button
        onClick={onInstaOAuth}
        disabled={integrated?.name === props.strategy}
        className="bg-gradient-to-br text-white rounded-full text-sm from-[#3352cc] font-medium to-[#1c2d70] hover:opacity-70 transition-all duration-100"
      >
        {integrated ? 'Connected' : 'Connect'}
      </Button>
    </div>
  );
};

export default IntegrationCard;
