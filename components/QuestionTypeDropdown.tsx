'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from './Icons';

const inputTypes = [
  { name: 'Short answer', icon: <Icons.shortAnswer /> },
  { name: 'Long answer', icon: <Icons.longAnswer /> },
  { name: 'Single select', icon: <Icons.radio /> },
  { name: 'URL', icon: <Icons.url /> },
  { name: 'Date', icon: <Icons.calendar /> },
];

export default function QuestionTypeDropdown() {
  const handleSelectInputType = (inputType: string) => {
    console.log(`Selected input type: ${inputType}`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='cursor-pointer items-center'
        >
          <Plus /> Add Question
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='shadow-custom-xl w-[18.75rem] rounded-2xl p-1'>
        <DropdownMenuLabel className='bg-bg-gray-50 text-gray-550 mb-1 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-[4%]'>
          INPUT TYPES
        </DropdownMenuLabel>
        {inputTypes.map((type) => (
          <DropdownMenuItem
            key={type.name}
            onClick={() => handleSelectInputType(type.name)}
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
