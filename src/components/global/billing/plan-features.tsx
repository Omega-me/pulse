import { Features } from '@/constants/features';
import { CircleCheck } from 'lucide-react';
import React from 'react';

interface Props {
  featureData: Features[];
}

const PlanFeatures = (props: Props) => {
  return (
    <>
      {props.featureData.map((f) => (
        <div className="flex items-center justify-start" key={f.id}>
          <span>
            <CircleCheck className="text-indigo-500 mr-5" />
          </span>
          <div className="">
            <p className="mt-2 text-muted-foreground">{f.feature}</p>
            <small className="text-muted-foreground flex gap-4">{f.description}</small>
          </div>
        </div>
      ))}
    </>
  );
};

export default PlanFeatures;
