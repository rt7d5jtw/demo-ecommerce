import * as React from 'react';
import './category-page.css';

interface ICategoryPage {
  category: string;
}

export function CategoryPage({ category }: ICategoryPage) {
  return (
    <div className='category-page'>
      <h1>{category}</h1>
    </div>
  )
}
