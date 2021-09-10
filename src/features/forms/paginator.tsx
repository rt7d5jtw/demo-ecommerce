import * as React from 'react';
import './paginator.css';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';

interface IPaginator {
  totalItems: number;
  elementsPerPage: number;
  currentPage: number;
  onChange: (page: number) => void;
}

export function Paginator({
  totalItems,
  elementsPerPage,
  currentPage,
  onChange,
}: IPaginator): JSX.Element {
  const totalPages = Math.ceil(totalItems / elementsPerPage);
  return (
    <div className='paginator'>
      <HiArrowCircleLeft
        id='prev-page'
        onClick={() => {
          currentPage !== 0 ? onChange(currentPage - 1) : null;
        }}
      />
      <div id='range-box'>
        {currentPage}/{totalPages - 1}
      </div>
      <HiArrowCircleRight
        id='next-page'
        onClick={() => {
          currentPage !== totalPages - 1 ? onChange(currentPage + 1) : null;
        }}
      />
    </div>
  );
}
