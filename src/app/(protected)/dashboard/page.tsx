'use client';

import Chart from '@/components/global/chart';
import DoubleGradientCard from '@/components/global/double-gradient-card';
import MetricsCard from '@/components/global/metrics-card';
import { DASHBOARD_CARDS } from '@/constants/dashboard';
import { ChartSpline } from 'lucide-react';
import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex gap-5 md:flex-row flex-col">
        {DASHBOARD_CARDS.map(c => (
          <DoubleGradientCard key={c.id} {...c} />
        ))}
      </div>
      <div className="border-[1px] relative border-muted-foreground/50 p-5 rounded-xl">
        <span className="flex gap-x-2 z-50 items-center">
          <ChartSpline color="#3352cc" />
          <div className="">
            <h2 className="text-2xl font-medium text-white">
              Automated Activity
            </h2>
            <p className="text-muted-foreground text-sm">
              Automated 0 out of 1 interactions
            </p>
          </div>
        </span>
        <div className="w-full flex flex-col lg:flex-row gap-5">
          <div className="lg:w-6/12">
            <Chart />
          </div>
          <div className="lg:w-6/12">
            <MetricsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
