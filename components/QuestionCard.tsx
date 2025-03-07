'use client';

import React from 'react';
import { Question, QuestionType } from '@/lib/types';
import { Input } from './ui/input';
import { Icons } from './Icons';
import { Button } from './ui/button';
import { Link, Hash, ChevronDown, Plus, Minus } from 'lucide-react';
import QuestionTypeDropdown from './QuestionTypeDropdown';
import { Textarea } from './ui/textarea';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface QuestionCardProps {
  question: Question;
  onUpdate: (id: string, data: Partial<Question>) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
}

export default function QuestionCard({
  question,
  onUpdate,
  dragHandleProps,
  isDragging = false,
}: QuestionCardProps) {
  const renderQuestionTypeIcon = () => {
    switch (question.type) {
      case QuestionType.ShortAnswer:
        return <Icons.shortAnswer className='h-5 w-5' />;
      case QuestionType.LongAnswer:
        return <Icons.longAnswer className='h-5 w-5' />;
      case QuestionType.SingleSelect:
        return <Icons.radio className='h-5 w-5' />;
      case QuestionType.Number:
        return <Hash className='h-5 w-5' />;
      case QuestionType.URL:
        return <Link className='h-5 w-5' />;
      case QuestionType.Date:
        return <Icons.calendar className='h-5 w-5' />;
      default:
        return null;
    }
  };

  const handleTypeChange = (type: QuestionType) => {
    let updatedData: Partial<Question> = { type };

    if (type === QuestionType.SingleSelect && !question.options) {
      updatedData.options = [
        { id: `option-${Date.now()}`, value: '' },
        { id: `option-${Date.now() + 1}`, value: '' },
      ];
    }

    onUpdate(question.id, updatedData);
  };

  const renderInput = () => {
    switch (question.type) {
      case QuestionType.ShortAnswer:
        return (
          <Input
            disabled
            className='bg-bg-gray-100 border-border-gray-200 h-8 py-0'
          />
        );
      case QuestionType.LongAnswer:
        return (
          <Textarea
            disabled
            className='bg-bg-gray-100 border-border-gray-200 h-20 w-full resize-none rounded-md border p-2 focus:outline-none'
          />
        );
      case QuestionType.SingleSelect:
        return (
          <div className='space-y-2'>
            {question.options?.map((option, index) => (
              <div key={option.id} className='flex items-center gap-2'>
                <Input
                  type='radio'
                  id={option.id}
                  name={question.id}
                  disabled
                  className='border-border-gray-200 h-4 w-4'
                />
                <Input
                  value={option.value}
                  onChange={(e) => {
                    const newOptions = [...(question.options || [])];
                    newOptions[index] = { ...option, value: e.target.value };
                    onUpdate(question.id, { options: newOptions });
                  }}
                  className='border-border-gray-200 h-8 flex-1 py-0 shadow-none focus-visible:ring-0'
                  placeholder={`Option ${index + 1}`}
                />
                {index === (question.options?.length || 0) - 1 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='cursor-pointer !px-2'
                    onClick={() => {
                      const newOptions = [...(question.options || [])];
                      newOptions.push({
                        id: `option-${Date.now()}`,
                        value: '',
                      });
                      onUpdate(question.id, { options: newOptions });
                    }}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                )}
                {index >= 1 &&
                  index !== (question.options?.length || 0) - 1 && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 cursor-pointer'
                      onClick={() => {
                        const newOptions = [...(question.options || [])];
                        newOptions.splice(index, 1);
                        onUpdate(question.id, { options: newOptions });
                      }}
                    >
                      <Minus className='h-4 w-4' />
                    </Button>
                  )}
              </div>
            ))}
          </div>
        );
      case QuestionType.Number:
        return (
          <Input
            disabled
            type='number'
            className='bg-bg-gray-100 border-border-gray-200 h-8 py-0'
          />
        );
      case QuestionType.URL:
        return (
          <Input
            disabled
            className='bg-bg-gray-100 border-border-gray-200 h-8 py-0'
            placeholder='http://example.com'
          />
        );
      case QuestionType.Date:
        return (
          <div className='relative'>
            <Input
              disabled
              className='bg-bg-gray-100 border-border-gray-200 h-8 py-0 pr-10'
              placeholder='MM-DD-YYYY'
            />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
              <Icons.calendar className='h-4 w-4 opacity-50' />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const typeIconTrigger = (
    <Button
      variant='ghost'
      size='icon'
      className='h-5 w-9 cursor-pointer gap-0 bg-transparent opacity-50 hover:bg-transparent hover:opacity-100'
    >
      {renderQuestionTypeIcon()}
      <ChevronDown className='h-4 w-4' />
    </Button>
  );

  return (
    <article
      className={`border-border-gray-200 mb-4 rounded-lg border p-4 ${
        isDragging ? 'bg-bg-gray-50 z-10' : ''
      }`}
    >
      <div className='flex items-center justify-between gap-2.5 md:gap-8'>
        <div className='flex w-full flex-col gap-1'>
          <Input
            value={question.title}
            onChange={(e) => onUpdate(question.id, { title: e.target.value })}
            placeholder='Write a question'
            className='h-5 border-none p-0 font-semibold shadow-none focus-visible:ring-0'
          />
          <Input
            value={question.helpText || ''}
            onChange={(e) =>
              onUpdate(question.id, { helpText: e.target.value })
            }
            placeholder='Write a help text or caption (leave empty if not needed).'
            className='h-4 border-none p-0 text-xs shadow-none focus-visible:ring-0'
          />
        </div>
        <div className='flex items-center gap-2'>
          <QuestionTypeDropdown
            onSelectType={handleTypeChange}
            triggerButton={typeIconTrigger}
          />
          <div
            {...dragHandleProps}
            className='cursor-grab rounded-md p-1 hover:bg-gray-100'
            title='Drag to reorder'
          >
            <Icons.dragDropVertical />
          </div>
        </div>
      </div>

      <div className='mt-2'>{renderInput()}</div>
    </article>
  );
}
