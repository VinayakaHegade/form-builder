'use client';

import React, { ReactNode } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from './Icons';
import { QuestionType } from '@/lib/types';

interface QuestionTypeDropdownProps {
  onSelectType: (type: QuestionType) => void;
  triggerButton?: ReactNode;
  label?: string;
}

const inputTypes = [
  { name: QuestionType.ShortAnswer, icon: <Icons.shortAnswer /> },
  { name: QuestionType.LongAnswer, icon: <Icons.longAnswer /> },
  { name: QuestionType.SingleSelect, icon: <Icons.radio /> },
  { name: QuestionType.Number, icon: <Icons.number /> },
  { name: QuestionType.URL, icon: <Icons.url /> },
  { name: QuestionType.Date, icon: <Icons.calendar /> },
  { name: QuestionType.Checkbox, icon: <Check /> },
];

export default function QuestionTypeDropdown({
  onSelectType,
  triggerButton,
  label,
}: QuestionTypeDropdownProps) {
  const defaultTrigger = (
    <Button variant='outline' size='sm' className='cursor-pointer items-center'>
      <Plus /> Add Question
    </Button>
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {triggerButton || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='shadow-custom-xl xs:w-[18.75rem] w-[90vw] rounded-2xl p-1'>
        {label && (
          <DropdownMenuLabel className='bg-bg-gray-50 text-gray-550 mb-1 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-[4%]'>
            {label}
          </DropdownMenuLabel>
        )}
        {inputTypes.map((type) => (
          <DropdownMenuItem
            key={type.name}
            onClick={() => onSelectType(type.name)}
            className='hover:bg-bg-gray-100 flex cursor-pointer items-center gap-2 rounded-lg p-2 font-medium'
          >
            <span className='h-5 w-5 flex-shrink-0'>{type.icon}</span>
            <span>{type.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
